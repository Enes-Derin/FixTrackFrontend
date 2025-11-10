import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 100%)",
                minHeight: "100vh",
            }}
            className="d-flex justify-content-center align-items-center text-light"
        >
            <Container className="text-center">
                {/* 404 Logo */}
                <h1
                    className="fw-bold display-1 mb-0"
                    style={{
                        color: "#dc3545",
                        textShadow: "0 0 20px rgba(220,53,69,0.6)",
                        letterSpacing: "2px",
                        animation: "pulse 2s infinite",
                    }}
                >
                    404
                </h1>

                {/* Alt başlık */}
                <h3 className="mb-3 text-light">Sayfa Bulunamadı</h3>
                <p className="text-secondary mb-4">
                    Aradığınız sayfa mevcut değil ya da taşınmış olabilir.
                </p>

                {/* Ana sayfaya dön */}
                <Button
                    variant="danger"
                    size="lg"
                    className="fw-semibold shadow-sm"
                    onClick={() => navigate("/dashboard")}
                >
                    ⬅️ Dashboard'a Dön
                </Button>


            </Container>
        </div>
    );
}

export default NotFoundPage;
