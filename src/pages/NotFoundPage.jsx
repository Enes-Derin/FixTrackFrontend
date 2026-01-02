import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                background:
                    "linear-gradient(135deg, rgba(230,126,34,0.1), rgba(26,37,47,0.9)), url('https://www.transparenttextures.com/patterns/concrete-wall.png')",
                backgroundSize: "cover",
            }}
        >
            <Container className="text-center">
                {/* 404 Kod */}
                <h1
                    className="fw-bold display-1 mb-0 text-primary"
                    style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                    404
                </h1>

                {/* Başlık */}
                <h3 className="mb-3 text-light" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                    Sayfa Bulunamadı
                </h3>

                {/* Açıklama */}
                <p className="text-muted mb-4" style={{ maxWidth: "400px", margin: "0 auto" }}>
                    Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
                </p>

                {/* Dashboard Dön Butonu */}
                <Button
                    className="custom-btn fw-semibold shadow-sm"
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                >
                    ⬅️ Dashboard'a Dön
                </Button>
            </Container>
        </div>
    );
}

export default NotFoundPage;
