import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)

def test_watchlist_routes_exist():
    response = client.get("/watchlist")
    assert response.status_code in [200, 500]
    data = response.json()
    assert "success" in data

def test_watchlist_add_validation():
    response = client.post("/watchlist", json={})
    assert response.status_code == 422
