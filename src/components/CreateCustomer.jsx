import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../redux/customesSlice";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

function CreateCustomer() {
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, company, email, phone, address } = formData;
        if (!name || !company || !email || !phone || !address) {
            setError("Lütfen tüm alanları doldurun.");
            return;
        }

        dispatch(createCustomer(formData));
        setSuccess(true);

        setTimeout(() => {
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card className="shadow-lg border-0">
                        <Card.Body>
                            <h2 className="text-center text-danger mb-4 fw-bold">
                                Yeni Müşteri Oluştur
                            </h2>

                            {error && <Alert variant="warning">{error}</Alert>}
                            {success && <Alert variant="success">Müşteri başarıyla oluşturuldu!</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Ad Soyad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Müşteri adı girin"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="company">
                                    <Form.Label>Firma Adı</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Firma adını girin"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>E-posta</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="E-posta adresi"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="phone">
                                    <Form.Label>Telefon</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Telefon numarası"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="address">
                                    <Form.Label>Adres</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Adres bilgisi"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button variant="danger" type="submit">
                                        Kaydet
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <div className="text-center mt-4 text-muted small">
                © {new Date().getFullYear()} FixTrack — Tüm hakları saklıdır.
            </div>
        </Container>
    );
}

export default CreateCustomer;
