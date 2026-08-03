from fastapi.testclient import TestClient

def test_auth_login_ayush(client: TestClient):
    response = client.post("/auth/login", json={"username": "Ayush", "password": "anypassword"})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "token" in data["data"]

def test_auth_me_with_token(client: TestClient):
    login_res = client.post("/auth/login", json={"username": "Ayush", "password": "anypassword"})
    token = login_res.json()["data"]["token"]
    
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["data"]["user"]["user_id"] == "user_ayush"
