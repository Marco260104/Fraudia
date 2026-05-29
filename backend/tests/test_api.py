from fastapi.testclient import TestClient
import pytest
import sys
from pathlib import Path

# Add backend src to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from src.app.api import app, compute_composite_score

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    json_data = response.json()
    assert "status" in json_data
    assert "database" in json_data

def test_kpis_endpoint():
    response = client.get("/api/kpis")
    assert response.status_code == 200
    json_data = response.json()
    assert "siniestros_analizados" in json_data
    assert "casos_criticos" in json_data
    assert "dinero_protegido" in json_data
    assert "riesgo_por_ciudad" in json_data
    assert "riesgo_por_ramo" in json_data

def test_cases_endpoint():
    response = client.get("/api/cases?limit=3")
    assert response.status_code == 200
    json_data = response.json()
    assert isinstance(json_data, list)
    if len(json_data) > 0:
        case = json_data[0]
        assert "id" in case
        assert "insured" in case
        assert "score" in case
        assert "score_breakdown" in case

def test_single_case_endpoint():
    # Test with standard mock ID
    response = client.get("/api/cases/FR-87291")
    assert response.status_code == 200
    case = response.json()
    assert "id" in case
    assert "amount" in case
    assert "score" in case
    assert "provider" in case
    assert "insured_info" in case

def test_calculator_validation():
    # Test negative amount validation
    payload = {
        "fecha_evento": "2025-05-28",
        "ramo": "Vehículos",
        "placa": "GBK-1234",
        "monto_reclamado": -1500.0,
        "id_proveedor": "TALLER-001"
    }
    response = client.post("/api/calculator", json=payload)
    assert response.status_code == 422 # Unprocessable Entity
    
    # Test invalid date validation
    payload["monto_reclamado"] = 15000.0
    payload["fecha_evento"] = "invalid-date"
    response = client.post("/api/calculator", json=payload)
    assert response.status_code == 422

    # Test valid calculator request
    payload["fecha_evento"] = "2025-05-28"
    response = client.post("/api/calculator", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "level" in data
    assert "alerts" in data

def test_nlp_compare_validation():
    payload = {
        "texto": ""
    }
    response = client.post("/api/narratives/compare", json=payload)
    assert response.status_code == 422

    payload["texto"] = "El vehículo fue impactado estacionado en la vía pública."
    response = client.post("/api/narratives/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_business_rules_composite_score():
    # Test strict combination: similarity=0.9, incomplete docs, restrictive list, proximity, late reporting
    # 0.9 * 30 = 27
    # incomplete = 15
    # restrictive = 25
    # proximity < 30 = 20
    # late > 7 = 10
    # total = 27 + 15 + 25 + 20 + 10 = 97
    score = compute_composite_score(0.9, "No", "Si", 15, 8)
    assert score == 97

    # Test clean combination: similarity=0.0, complete docs, no restrictive list, late proximity, normal reporting
    # 0 + 0 + 0 + 0 + 0 = 0
    score = compute_composite_score(0.0, "Si", "No", 120, 2)
    assert score == 0
