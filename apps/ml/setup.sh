#!/bin/bash
# Setup script for ML recommendation system
# Run this to install dependencies and test the system

set -e  # Exit on error

echo "==========================================="
echo "ML Recommendation System - Setup"
echo "==========================================="
echo ""

# Check Python version
echo "Checking Python installation..."
python3 --version || { echo "Error: Python 3 is not installed"; exit 1; }
echo "✓ Python 3 found"
echo ""

# Check if venv package is available
echo "Checking python3-venv..."
if ! python3 -m venv --help &> /dev/null; then
    echo "⚠️  python3-venv is not installed"
    echo ""
    echo "Please install it first:"
    echo "  sudo apt install python3.12-venv"
    echo ""
    exit 1
fi
echo "✓ python3-venv found"
echo ""

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
    echo ""
fi

# Activate virtual environment and install dependencies
echo "Installing dependencies in virtual environment..."
./venv/bin/pip install -r requirements.txt
echo "✓ Dependencies installed"
echo ""

# Generate mock data
echo "Generating mock accommodation data..."
./venv/bin/python data_generator.py
echo ""

# Run unit tests
echo "Running unit tests..."
./venv/bin/python -m pytest test_recommender.py -v
echo ""

# Run recommendation engine demo
echo "Running recommendation engine demo..."
./venv/bin/python recommender.py | head -n 80
echo ""

# Run evaluation
echo "Running evaluation..."
./venv/bin/python evaluation.py | tail -n 40
echo ""

echo "==========================================="
echo "✓ Setup complete!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "  - Review ML_progress.md for implementation details"
echo "  - Check mock_accommodations.json for generated data"
echo "  - Examine evaluation results above"
echo ""
echo "To run scripts manually, use:"
echo "  ./venv/bin/python <script_name>.py"
echo ""
