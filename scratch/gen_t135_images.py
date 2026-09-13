import os
import matplotlib.pyplot as plt
import numpy as np

# Ensure directories exist
dirs = [
    'public/images',
    'dist/images',
    'QBank/public/images',
    'QBank/dist/images'
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

print("Generator script template ready.")
