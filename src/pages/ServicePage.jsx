import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    getServices,
    getServiceByCustomerId,
    deleteService,
} from "../redux/serviceSlice";
import { getCustomers } from "../redux/customesSlice";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Form,
    Badge,
} from "react-bootstrap";

function ServicePage() {
    const dispatch = useDispatch();

    const { services, isLoading } = useSelector((state) => state.service);
    const customers = useSelector((state) => state.customer.customers);

    const [customerId, setCustomerId] = useState("");

    /* İlk yükleme */
    useEffect(() => {
        dispatch(getServices());
        dispatch(getCustomers());
    }, [dispatch]);

    /* Otomatik filtre */
    useEffect(() => {
        if (customerId) {
            dispatch(getServiceByCustomerId(customerId));
        } else {
            dispatch(getServices());
        }
    }, [customerId, dispatch]);

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
                    <h3 className="text-primary fw-bold mb-1">
                        Servis Yönetimi
                    </h3>
                    <p className="small text-light mb-0">
                        Tüm servis kayıtlarını buradan yönetin
                    </p>
                </Col>
                <Col className="text-end">
                    <Link to="/service/add">
                        <Button size="sm" className="custom-btn">
                            + Yeni Servis
                        </Button>
                    </Link>
                </Col>
            </Row>

            {/* FILTER */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <Form.Label className="small">
                        Müşteriye Göre Filtrele
                    </Form.Label>
                    <Form.Select
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                    >
                        <option value="">Tüm Müşteriler</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.company}
                            </option>
                        ))}
                    </Form.Select>
                </Card.Body>
            </Card>

            {/* LOADING */}
            {isLoading && (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            )}

            {/* EMPTY */}
            {!isLoading && services.length === 0 && (
                <p className="text-center text-light py-5">
                    Kayıtlı servis bulunamadı.
                </p>
            )}

            {/* LIST */}
            <Row className="g-3">
                {services.map((s) => (
                    <Col xs={12} md={6} lg={4} key={s.id}>
                        <Card className="custom-card h-100 p-3 shadow-sm">
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <Card.Title className="fw-bold">
                                            {s.title}
                                        </Card.Title>
                                        <Badge bg="secondary">
                                            {s.customer?.company || "-"}
                                        </Badge>
                                    </div>

                                    <Card.Text className="small">
                                        {s.description || "-"}
                                    </Card.Text>
                                </div>

                                <div className="d-flex gap-2 mt-3">
                                    <Link
                                        to={`/service/${s.id}`}
                                        className="flex-fill"
                                    >
                                        <Button
                                            size="sm"
                                            variant="outline-secondary"
                                            className="w-100"
                                        >
                                            Görüntüle
                                        </Button>
                                    </Link>

                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        className="w-100"
                                        onClick={() =>
                                            deleteServiceById(s.id)
                                        }
                                    >
                                        Sil
                                    </Button>
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
