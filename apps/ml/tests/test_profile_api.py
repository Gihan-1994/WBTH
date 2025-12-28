"""
Test if the profile API is returning location field.
"""
import requests

try:
    # Test the profile endpoint (will fail with 401 but shows response structure)
    response = requests.post('http://localhost:3000/api/accommodation-provider/profile')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
