from fastapi.testclient import TestClient

def test_get_stats(client: TestClient):
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True

def test_get_detailed_stats(client: TestClient):
    response = client.get("/stats/detailed")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "statusDistribution" in data["data"]
    assert "completionRate" in data["data"]

def test_admin_health(client: TestClient):
    response = client.get("/admin/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "status" in data["data"]
    assert "redis" in data["data"]
