import os
import sys

def count_loc(dir_path):
    total_lines = 0
    total_files = 0
    ignored_dirs = {'node_modules', '.next', '__pycache__', '.git', '.venv', 'venv'}
    for root, dirs, files in os.walk(dir_path):
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        for file in files:
            if file.endswith(('.py', '.tsx', '.ts', '.js', '.jsx', '.css', '.html')):
                try:
                    with open(os.path.join(root, file), 'r', encoding='utf-8', errors='ignore') as f:
                        lines = sum(1 for line in f)
                        total_lines += lines
                        total_files += 1
                except:
                    pass
    return total_files, total_lines

f, l = count_loc(r"c:\Users\USER\Desktop\SOB_SurveyOptimizationBureau\SOB")
print(f"Total Source Code Files: {f}")
print(f"Total Lines of Code: {l:,}")
