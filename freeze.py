from app import app, load_data, get_integrity_hash
import datetime

# Create a request context so we can use url_for and render_template
with app.test_request_context():
    data = load_data()
    last_scanned = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
    # Simulate a hash since we might not be able to read the data file in the same way depending on path
    # But get_integrity_hash uses an absolute path constant in app.py, so it should work.
    try:
        integrity_check = get_integrity_hash()
    except:
        integrity_check = "STATIC-BUILD"

    # Render the template
    # We call the function that usually renders the template, or just render it directly
    # Since index() in app.py does simple rendering, we mimic it here.
    from flask import render_template
    rendered_html = render_template('index.html', 
                                  data=data, 
                                  last_scanned=last_scanned, 
                                  integrity=integrity_check)

    # Write to index.html in the root directory
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(rendered_html)

    print("Successfully built index.html for static deployment.")
