#!/bin/bash

# Codebase Scraper Script
# This script collects all code files from the repository, excluding .git and node_modules

# Output file
OUTPUT_FILE="codebase-snapshot.txt"

# Get the script's directory (project root)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting codebase scrape from: $PROJECT_ROOT"
echo "Output file: $OUTPUT_FILE"
echo "----------------------------------------"

# Clear or create the output file
> "$OUTPUT_FILE"

# Add header
echo "==============================================================" >> "$OUTPUT_FILE"
echo "CODEBASE SNAPSHOT - Generated on $(date)" >> "$OUTPUT_FILE"
echo "Project Root: $PROJECT_ROOT" >> "$OUTPUT_FILE"
echo "==============================================================" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Counter for files
file_count=0

# Find all files, excluding .git, node_modules, and other build/cache directories
find "$PROJECT_ROOT" -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/.next/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -not -path "*/.cache/*" \
  -not -path "*/coverage/*" \
  -not -path "*/.turbo/*" \
  -not -path "*/.gemini/*" \
  -not -path "*/venv/*" \
  -not -path "*/__pycache__/*" \
  -not -path "*/.pytest_cache/*" \
  -not -path "*/.venv/*" \
  -not -path "*/env/*" \
  -not -path "*/.env/*" \
  -not -path "*/out/*" \
  -not -path "*/.vercel/*" \
  -not -path "*/.swc/*" \
  -not -name "*.log" \
  -not -name "*.lock" \
  -not -name "package-lock.json" \
  -not -name "yarn.lock" \
  -not -name "pnpm-lock.yaml" \
  -not -name ".DS_Store" \
  -not -name "*.pyc" \
  -not -name "*.pyo" \
  -not -name "*.pyd" \
  -not -name "$OUTPUT_FILE" | sort | while read -r file; do
  
  # Get relative path
  rel_path="${file#$PROJECT_ROOT/}"
  
  # Increment counter
  ((file_count++))
  
  # Add file header
  echo "" >> "$OUTPUT_FILE"
  echo "==============================================================" >> "$OUTPUT_FILE"
  echo "FILE: $rel_path" >> "$OUTPUT_FILE"
  echo "==============================================================" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  # Check if file is binary
  if file "$file" | grep -q "text"; then
    # Add file contents
    cat "$file" >> "$OUTPUT_FILE"
  else
    echo "[Binary file - content not included]" >> "$OUTPUT_FILE"
  fi
  
  # Add separator
  echo "" >> "$OUTPUT_FILE"
  echo "" >> "$OUTPUT_FILE"
  
  # Progress indicator
  echo "Processed: $rel_path"
done

# Add footer
echo "==============================================================" >> "$OUTPUT_FILE"
echo "END OF CODEBASE SNAPSHOT" >> "$OUTPUT_FILE"
echo "Total files processed: $file_count" >> "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "==============================================================" >> "$OUTPUT_FILE"

echo "----------------------------------------"
echo "Scraping complete!"
echo "Output saved to: $OUTPUT_FILE"
echo "Total files processed: $file_count"
