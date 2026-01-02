import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../redux/customesSlice";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
} from "react-bootstrap";

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

        setTimeout(() => navigate("/dashboard"), 1500);
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center premium-bg">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={8} lg={5}>
                    <Card className="border-0 shadow-lg premium-card">
                        <Card.Body className="p-4 p-md-5">
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div className="mb-2 fs-2">🔧</div>
                                <h3 className="fw-bold text-accent mb-1">Yeni Müşteri</h3>
                                <p className="text-muted small">
                                    Müşteri bilgilerini eksiksiz doldurun
                                </p>
                            </div>

                            {/* Alerts */}
                            {error && (
                                <Alert variant="warning" className="text-center premium-alert">
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="success" className="text-center premium-alert">
                                    Müşteri başarıyla oluşturuldu!
                                </Alert>
                            )}

                            {/* Form */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ad Soyad</Form.Label>
                                    <Form.Control
                                        name="name"
                                        placeholder="Örn: Ahmet Yılmaz"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Firma Adı</Form.Label>
                                    <Form.Control
                                        name="company"
                                        placeholder="Örn: ABC Teknik"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>E-posta</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                placeholder="mail@firma.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="premium-input"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Telefon</Form.Label>
                                            <Form.Control
                                                name="phone"
                                                placeholder="05xx xxx xx xx"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="premium-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label>Adres</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Açık adres bilgisi"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button
                                        type="submit"
                                        variant="danger"
                                        size="lg"
                                        className="fw-bold premium-btn"
                                    >
                                        Müşteriyi Kaydet
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}

export default CreateCustomer;
