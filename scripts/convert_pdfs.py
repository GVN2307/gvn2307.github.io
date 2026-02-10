import fitz  # PyMuPDF
import os

def convert_pdfs_to_images(pdf_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    for filename in os.listdir(pdf_dir):
        if filename.lower().endswith('.pdf'):
            pdf_path = os.path.join(pdf_dir, filename)
            output_name = filename.rsplit('.', 1)[0].replace(' ', '-').lower() + '.jpg'
            output_path = os.path.join(output_dir, output_name)
            
            # Skip if image already exists
            if os.path.exists(output_path):
                print(f"Skipping {filename}, image exists.")
                continue
                
            try:
                doc = fitz.open(pdf_path)
                page = doc.load_page(0)  # first page
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # upscale for better quality
                pix.save(output_path)
                print(f"Converted {filename} -> {output_name}")
                doc.close()
            except Exception as e:
                print(f"Error converting {filename}: {e}")

if __name__ == "__main__":
    pdf_directory = os.path.join('static', 'certificates')
    output_directory = os.path.join('static', 'badges')
    convert_pdfs_to_images(pdf_directory, output_directory)
