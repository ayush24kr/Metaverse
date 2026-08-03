from fastapi.testclient import TestClient
from apps.api.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["message"] == "API is healthy"

def test_media_search():
    response = client.get("/media/search?q=Interstellar")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "items" in data["data"]
