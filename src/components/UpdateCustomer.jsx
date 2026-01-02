import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getCustomer, updateCustomer } from "../redux/customesSlice";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Spinner,
    Alert,
} from "react-bootstrap";

function UpdateCustomer() {
    const [customer, setCustomer] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        address: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const result = await dispatch(getCustomer(id)).unwrap();
                setCustomer(result);
            } catch (err) {
                console.error("Müşteri bilgisi alınamadı:", err);
                setError("Müşteri bilgisi alınamadı.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [dispatch, id]);

    const handleChange = (e) => {
        setCustomer({
            ...customer,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateCustomer(customer)).unwrap();
            setSuccess(true);
            setTimeout(() => navigate("/dashboard"), 1500);
        } catch (err) {
            console.error("Müşteri güncellenirken hata:", err);
            setError("Güncelleme sırasında bir hata oluştu.");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant="danger" />
            </div>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card className="shadow-lg border-0 custom-card">
                        <Card.Body className="p-4 p-md-5">
                            <h2 className="text-center text-accent mb-4 fw-bold">
                                Müşteri Bilgilerini Güncelle
                            </h2>

                            {error && (
                                <Alert variant="warning" className="custom-alert text-center">
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert variant="success" className="custom-alert text-center">
                                    Müşteri başarıyla güncellendi!
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Ad Soyad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={customer.name || ""}
                                        onChange={handleChange}
                                        placeholder="Ad soyad girin"
                                        className="custom-input"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="company">
                                    <Form.Label>Firma Adı</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="company"
                                        value={customer.company || ""}
                                        onChange={handleChange}
                                        placeholder="Firma adını girin"
                                        className="custom-input"
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>E-posta</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={customer.email || ""}
                                                onChange={handleChange}
                                                placeholder="E-posta adresini girin"
                                                className="custom-input"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="phone">
                                            <Form.Label>Telefon</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="phone"
                                                value={customer.phone || ""}
                                                onChange={handleChange}
                                                placeholder="Telefon numarası"
                                                className="custom-input"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4" controlId="address">
                                    <Form.Label>Adres</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="address"
                                        value={customer.address || ""}
                                        onChange={handleChange}
                                        placeholder="Adres bilgisi"
                                        className="premium-input"
                                    />
                                </Form.Group>

                                <div className="d-grid">
                                    <Button
                                        variant="danger"
                                        type="submit"
                                        className="fw-bold custom-btn py-2"
                                    >
                                        Güncelle
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

export default UpdateCustomer;
