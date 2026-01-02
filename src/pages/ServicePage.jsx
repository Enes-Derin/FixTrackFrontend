import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServices, getServiceByCustomerId, deleteService } from "../redux/serviceSlice";
import { getCustomers } from "../redux/customesSlice";
import { Container, Row, Col, Card, Button, Spinner, Form, Badge } from "react-bootstrap";

function ServicePage() {
    const dispatch = useDispatch();
    const { services, isLoading } = useSelector((state) => state.service);
    const customers = useSelector((state) => state.customer.customers);
    const [customerId, setCustomerId] = useState("");

    useEffect(() => {
        dispatch(getServices());
        dispatch(getCustomers());
    }, [dispatch]);

    const handleFilter = () => {
        customerId ? dispatch(getServiceByCustomerId(customerId)) : dispatch(getServices());
    };

    const deleteServiceById = (id) => {
        if (window.confirm("Bu servisi silmek istediğinizden emin misiniz?")) {
            dispatch(deleteService(id));
        }
    };

    return (
        <Container fluid className="py-4">
            {/* HEADER */}
            <Row className="align-items-center mb-4">
                <Col>
                    <h3 className="text-primary fw-bold mb-1">Servis Yönetimi</h3>
                    <p className="small text-light mb-0">Tüm servis kayıtlarını buradan yönetin</p>
                </Col>
                <Col className="text-end">
                    <Link to="/service/add">
                        <Button className="custom-btn fw-semibold" size="sm">+ Yeni Servis</Button>
                    </Link>
                </Col>
            </Row>

            {/* FILTER */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Row className="align-items-end g-3">
                        <Col xs={12} md={9}>
                            <Form.Label className="small">Müşteriye Göre Filtrele</Form.Label>
                            <Form.Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                                <option value="">Tüm Müşteriler</option>
                                {customers.map((c) => <option key={c.id} value={c.id}>{c.company}</option>)}
                            </Form.Select>
                        </Col>
                        <Col xs={12} md={3}>
                            <Button className="custom-btn w-100" onClick={handleFilter}>Filtrele</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* LOADING */}
            {isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}

            {/* EMPTY */}
            {!isLoading && services.length === 0 && <p className="text-center text-muted py-5">Henüz kayıtlı servis bulunmuyor.</p>}

            {/* CARDS GRID */}
            <Row className="g-3">
                {services.map((s) => (
                    <Col xs={12} md={6} lg={4} key={s.id}>
                        <Card className="custom-card p-3 h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column justify-content-between h-100">
                                <div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <Card.Title className="fw-bold">{s.title}</Card.Title>
                                        <Badge bg="secondary">{s.customer?.company || "—"}</Badge>
                                    </div>
                                    <Card.Text className="small">
                                        {s.description ? (s.description.length > 70 ? s.description.slice(0, 70) + "..." : s.description) : "-"}
                                    </Card.Text>
                                    <div className="small mt-1">
                                        {s.createdDate ? new Date(s.createdDate).toLocaleDateString("tr-TR") : "-"}
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <Link to={`/service/${s.id}`} className="flex-fill text-decoration-none">
                                        <Button variant="outline-secondary" size="sm" className="w-100">Görüntüle</Button>
                                    </Link>
                                    <Button variant="outline-danger" size="sm" className="w-100" onClick={() => deleteServiceById(s.id)}>Sil</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ServicePage;
