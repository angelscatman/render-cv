#!/bin/bash
set -euo pipefail

# 1. Input validation
if [ -z "$1" ]; then
  echo "Error: You must provide the profile directory."
  echo "Usage: ./render.sh <profile-directory-name>"
  exit 1
fi

PROFILE=$1
OUTPUT_DIR="PDFs"
IMAGE_NAME="local-rendercv"

# 2. Build the local Docker image if it does not exist
if [[ "$(docker images -q $IMAGE_NAME 2> /dev/null)" == "" ]]; then
  echo "Building local Docker image ($IMAGE_NAME)..."
  docker build -t $IMAGE_NAME -f Dockerfile .
fi

# 3. Create the main output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# 4. Navigate to the target directory and run the local container
cd "$PROFILE" || exit
echo "Compiling profile: $PROFILE..."
docker run --rm \
  -u "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -v "$(pwd)":/workspace \
  -w /workspace \
  $IMAGE_NAME render cv.yaml --design design.yaml --locale-catalog locale.yaml --settings settings.yaml

# 5. Locate, rename, and move the final document
GENERATED_PDF=$(find rendercv_output -name "*.pdf" | head -n 1)

if [ -n "$GENERATED_PDF" ]; then
  # Move the file to the root output directory with the profile name
  mv "$GENERATED_PDF" "../$OUTPUT_DIR/${PROFILE}.pdf"
  echo "Success: Document safely stored at $OUTPUT_DIR/${PROFILE}.pdf"
  
  # 6. Clean up intermediate compilation files
  rm -rf rendercv_output
else
  echo "Error: The PDF generation failed."
fi

cd ..