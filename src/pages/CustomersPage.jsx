import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomer, getCustomers } from "../redux/customesSlice";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner, Alert } from "react-bootstrap";

function CustomersPage() {
    const dispatch = useDispatch();
    const { customers, isLoading, error } = useSelector((state) => state.customer);

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    const deleteCustomerById = (id) => {
        if (window.confirm("Bu müşteriyi silmek istediğine emin misin?")) {
            dispatch(deleteCustomer(id));
        }
    };

    return (
        <Container fluid className="py-4">
            {/* HEADER */}
            <Row className="align-items-center mb-4">
                <Col>
                    <h3 className="text-primary fw-bold mb-1">Müşteri Yönetimi</h3>
                    <p className="small text-light mb-0">Müşterileri görüntüle, düzenle veya sil</p>
                </Col>
                <Col className="text-end">
                    <Link to="/createCustomer">
                        <Button className="custom-btn fw-semibold" size="sm">+ Yeni Müşteri</Button>
                    </Link>
                </Col>
            </Row>

            {/* LOADING */}
            {isLoading && <div className="text-center py-5"><Spinner animation="border" /></div>}

            {/* ERROR */}
            {error && <Alert variant="danger" className="text-center">{error}</Alert>}

            {/* EMPTY */}
            {!isLoading && customers.length === 0 && <p className="text-center text-muted py-5">Henüz kayıtlı müşteri bulunmuyor.</p>}

            {/* CARDS GRID */}
            <Row className="g-3">
                {customers.map((c) => (
                    <Col xs={12} md={6} lg={4} key={c.id}>
                        <Card className="custom-card p-3 h-100 shadow-sm">
                            <Card.Body className="d-flex flex-column justify-content-between h-100">
                                <div>
                                    <Card.Title className="fw-bold">{c.name}</Card.Title>
                                    <Card.Subtitle className="mb-2">{c.company}</Card.Subtitle>
                                    <div className="small">
                                        <div>📧 {c.email}</div>
                                        <div>📞 {c.phone}</div>
                                    </div>
                                </div>
                                <div className="mt-3 d-flex gap-2">
                                    <Link to={`/customerUpdate/${c.id}`} className="flex-fill text-decoration-none">
                                        <Button variant="outline-secondary" size="sm" className="w-100">Düzenle</Button>
                                    </Link>
                                    <Button variant="outline-danger" size="sm" className="w-100" onClick={() => deleteCustomerById(c.id)}>Sil</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default CustomersPage;
