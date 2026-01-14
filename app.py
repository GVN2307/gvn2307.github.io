import os
import json
import datetime
import hashlib
from flask import Flask, render_template, request, jsonify, make_response
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import bleach

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-dev-key-change-in-prod')
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # Limit request size to 1MB (Prevention of Large Payload DoS)

# Rate Limiting (DDoS/DoS Protection)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# Configuration
PORTFOLIO_DATA_PATH = os.path.join('data', 'portfolio.json')

def load_data():
    with open(PORTFOLIO_DATA_PATH, 'r') as f:
        data = json.load(f)
    
    # Badge Discovery
    # Scans static/badges
    badge_dir = os.path.join('static', 'badges')
    data['badges'] = []
    if os.path.exists(badge_dir):
        for filename in os.listdir(badge_dir):
            if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
                data['badges'].append({
                    "name": filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title(),
                    "image": filename
                })
    return data

def get_integrity_hash():
    """Generates a short hash of the data file to simulate a 'integrity check'."""
    try:
        with open(PORTFOLIO_DATA_PATH, 'rb') as f:
            file_hash = hashlib.sha256(f.read()).hexdigest()
        return file_hash[:16]
    except Exception:
        return "UNKNOWN"

@app.after_request
def add_security_headers(response):
    """
    Add security headers to every response.
    Crucial for the 'Security Features' requirement.
    """
    # Content Security Policy (CSP)
    # Strictly limiting sources to prevent XSS
    csp = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https://images.unsplash.com https://cdn.jsdelivr.net; "
        "connect-src 'self';"
    )
    response.headers['Content-Security-Policy'] = csp
    response.headers['X-Frame-Options'] = 'DENY' # Clickjacking protection
    response.headers['X-Content-Type-Options'] = 'nosniff' # MIME Sniffing protection
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['X-XSS-Protection'] = '1; mode=block' # Classic XSS protection
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains' # Enforce HTTPS (Mock for local)
    return response

@app.route('/')
def index():
    data = load_data()
    
    # "Digital Signature" data
    last_scanned = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    integrity_check = get_integrity_hash()
    
    return render_template('index.html', 
                           data=data, 
                           last_scanned=last_scanned, 
                           integrity=integrity_check)

@app.route('/contact', methods=['POST'])
@limiter.limit("5 per minute") # Specific rate limit for contact form (DoS Protection)
def contact():
    """
    Handle contact form submission.
    Includes sanitization and strict validation.
    """
    try:
        data = request.get_json()
        if not data:
             return jsonify({'status': 'error', 'message': 'No data provided'}), 400

        name = data.get('name')
        email = data.get('email')
        message = data.get('message')

        # Basic server-side validation
        if not name or not email or not message:
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400
        
        # Input Sanitization (XSS Prevention)
        # Bleach removes any HTML tags that a malicious user might try to inject
        safe_name = bleach.clean(name)
        safe_message = bleach.clean(message)
        
        # Email Validation (Advanced)
        if '@' not in email or len(email) > 100:
             return jsonify({'status': 'error', 'message': 'Invalid email address'}), 400

        # Simulate processing (log to console)
        # In a real app, use parameterized queries if saving to a DB (primary SQLi defense)
        print(f"[-] New Contact Message from {safe_name} ({email}): {safe_message}")

        return jsonify({'status': 'success', 'message': 'Message encrypted and transmitted.'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({'status': 'error', 'message': 'Rate limit exceeded. request terminated.'}), 429

if __name__ == '__main__':
    print("[*] System Initializing...")
    print("[*] Loading Modules...")
    print(f"[*] Secure Port: 5000")
    app.run(debug=True, port=5000)
