import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure apps/api directory is in Python path for test execution
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

@pytest.fixture
def client():
    return TestClient(app)
