import os
import zipfile
import xml.etree.ElementTree as ET

def extract_text_from_pptx(pptx_path):
    text_content = []
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            slide_files = [f for f in z.namelist() if f.startswith('ppt/slides/slide') and f.endswith('.xml')]
            # Sort slides by number
            slide_files.sort(key=lambda x: int(''.join(filter(str.isdigit, x))))
            
            for slide_file in slide_files:
                with z.open(slide_file) as f:
                    tree = ET.parse(f)
                    root = tree.getroot()
                    
                    # Namespace for DrawingML
                    namespaces = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
                    
                    slide_text = []
                    for node in root.findall('.//a:t', namespaces):
                        if node.text:
                            slide_text.append(node.text)
                    if slide_text:
                        text_content.append(" ".join(slide_text))
    except Exception as e:
        return f"Error extracting from {pptx_path}: {e}"
    
    return "\n\n--- Slide ---\n".join(text_content)

files = [
    "ADO Overview 1.pptx",
    "BY Financials Training.pptx",
    "CCS Release Management - TDM Guide.pptx",
    "Digital Compass Guide Training Program 1.pptx",
    "Portfolio structure.pptx"
]

with open("pptx_content.txt", "w", encoding="utf-8") as out_f:
    for f in files:
        out_f.write(f"================ {f} ================\n")
        out_f.write(extract_text_from_pptx(f) + "\n")
        out_f.write("\n")

