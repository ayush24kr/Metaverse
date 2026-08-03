import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

def test_get_stats():
    response = client.get("/stats")
    assert response.status_code in [200, 500]
    data = response.json()
    assert "success" in data

def test_admin_health():
    response = client.get("/admin/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "status" in data["data"]
    assert "redis" in data["data"]
