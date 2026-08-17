import win32com.client
import os
import sys

def merge_presentations(file1, file2, outfile):
    try:
        # Get absolute paths
        file1 = os.path.abspath(file1)
        file2 = os.path.abspath(file2)
        outfile = os.path.abspath(outfile)

        print(f"Merging {file1} and {file2} into {outfile}")
        
        # Start PowerPoint
        Application = win32com.client.Dispatch("PowerPoint.Application")
        
        # Create a new presentation
        new_prs = Application.Presentations.Add(WithWindow=False)
        
        # Insert slides from first presentation
        new_prs.Slides.InsertFromFile(file1, 0)
        
        # Insert slides from second presentation
        slide_count = new_prs.Slides.Count
        new_prs.Slides.InsertFromFile(file2, slide_count)
        
        # Save as the new combined file
        new_prs.SaveAs(outfile)
        
        # Close everything
        new_prs.Close()
        Application.Quit()
        print("Merged successfully to", outfile)
    except Exception as e:
        print(f"Error merging presentations: {e}")
        try:
            Application.Quit()
        except:
            pass
        sys.exit(1)

if __name__ == "__main__":
    cwd = r"d:\github repos\TDM"
    f1 = os.path.join(cwd, "TDM_Nexus_Presentation_v2.pptx")
    f2 = os.path.join(cwd, "TDM Nexus Presentation 13-8-2026.pptx")
    out = os.path.join(cwd, "TDM_Nexus_Combined.pptx")
    merge_presentations(f1, f2, out)
