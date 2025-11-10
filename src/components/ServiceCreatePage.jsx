import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addService } from "../redux/serviceSlice";
import { getCustomers } from "../redux/customesSlice";
import { Container, Card, Form, Button, Spinner, Alert } from "react-bootstrap";

function ServiceCreatePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customers, isLoading, error } = useSelector(
        (state) => state.customer
    );

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !description || !customerId) {
            setErrorMessage("Lütfen tüm alanları doldurun.");
            return;
        }

        const service = {
            title,
            description,
            customerId,
        };

        dispatch(addService(service));
        navigate("/dashboard");
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center bg-light py-5"
            style={{ minHeight: "100vh" }}
        >
            <Card
                className="shadow-lg p-4 border-0"
                style={{
                    width: "100%",
                    maxWidth: "550px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <h3 className="fw-bold text-danger text-center mb-4">
                    🛠 Yeni Servis Oluştur
                </h3>
                <p className="text-muted text-center mb-4">
                    Servis detaylarını girin ve ilgili müşteriyi seçin.
                </p>

                <Form onSubmit={handleSubmit}>
                    {/* Title */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Servis Başlığı</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Örn: Kompresör Bakımı"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow-sm"
                        />
                    </Form.Group>

                    {/* Description */}
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Açıklama</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Servisle ilgili açıklama yazın..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow-sm"
                        />
                    </Form.Group>

                    {/* Customer Select */}
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">
                            Müşteri (Şirket Adı)
                        </Form.Label>
                        <Form.Select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            className="shadow-sm"
                        >
                            <option value="">-- Müşteri Seçin --</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.company}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* Loading / Error / Validation */}
                    {isLoading && (
                        <div className="text-center my-2">
                            <Spinner animation="border" variant="danger" size="sm" />
                        </div>
                    )}

                    {errorMessage && (
                        <Alert variant="warning" className="py-2 text-center">
                            {errorMessage}
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="danger" className="py-2 text-center">
                            {error}
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <div className="d-grid">
                        <Button
                            type="submit"
                            variant="danger"
                            size="lg"
                            className="fw-bold shadow-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? "Kaydediliyor..." : "Servisi Kaydet"}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}

export default ServiceCreatePage;
