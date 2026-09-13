import os
import glob

xlsx_files = glob.glob("**/*.xlsx", recursive=True)
print("Found Excel files:")
for f in xlsx_files:
    print(" ", f)

