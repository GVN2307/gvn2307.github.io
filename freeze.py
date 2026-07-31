from app import app, load_data, get_integrity_hash
import datetime
from flask import render_template, request

# Generate general properties outside request contexts
data = load_data()
last_scanned = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")

try:
    integrity_check = get_integrity_hash()
except Exception:
    integrity_check = "STATIC-BUILD"

# Define pages to freeze: (template_name, output_filename)
pages = [
    ('home.html', 'index.html'),
    ('about.html', 'about.html'),
    ('skills.html', 'skills.html'),
    ('projects.html', 'projects.html'),
    ('badges.html', 'badges.html'),
    ('contact.html', 'contact.html')
]

for template_name, output_filename in pages:
    # Use matching paths to trigger correct endpoint resolution in Flask
    path = '/' if output_filename == 'index.html' else f'/{output_filename}'
    with app.test_request_context(path=path):
        rendered_html = render_template(
            template_name, 
            data=data, 
            last_scanned=last_scanned, 
            integrity=integrity_check
        )

        # Write to the root directory
        with open(output_filename, 'w', encoding='utf-8') as f:
            f.write(rendered_html)

        print(f"Successfully built {output_filename} for static deployment with endpoint '{request.endpoint}'.")
