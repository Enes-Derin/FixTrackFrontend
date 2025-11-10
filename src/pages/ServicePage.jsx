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
    Button,
    Table,
    Badge,
    Form,
    Spinner,
    Card,
} from "react-bootstrap";

function ServicePage() {
    const dispatch = useDispatch();
    const navigate = useSelector;
    const { services, isLoading } = useSelector((state) => state.service);
    const customers = useSelector((state) => state.customer.customers);

    const [customerId, setCustomerId] = useState("");

    useEffect(() => {
        dispatch(getServices());
        dispatch(getCustomers());
    }, [dispatch]);

    const handleFilter = () => {
        if (customerId.trim() === "") {
            dispatch(getServices());
        } else {
            dispatch(getServiceByCustomerId(customerId));
        }
    };

    const deleteServiceById = (id) => {
        if (window.confirm("Bu servisi silmek istediğinizden emin misiniz?")) {
            dispatch(deleteService(id));
        }
    };



    return (
        <Container className="py-5">
            {/* HEADER */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="fw-bold text-danger mb-0">Servis Yönetimi</h2>
                    <p className="text-muted">Servisleri görüntüle, filtrele veya yönet.</p>
                </Col>
                <Col className="text-end">
                    <Link to="/service/add">
                        <Button variant="danger">+ Yeni Servis</Button>
                    </Link>
                </Col>
            </Row>

            {/* FİLTRE */}
            <Card className="p-3 mb-4 shadow-sm">
                <Row className="align-items-end">
                    <Col md={8}>
                        <Form.Group>
                            <Form.Label>Müşteriye Göre Filtrele</Form.Label>
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
                        </Form.Group>
                    </Col>
                    <Col md={4} className="text-end mt-3 mt-md-0">
                        <Button variant="outline-danger" onClick={handleFilter}>
                            Filtrele
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* TABLO */}
            {isLoading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="danger" />
                </div>
            ) : services && services.length > 0 ? (
                <Table striped bordered hover responsive className="align-middle shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Başlık</th>
                            <th>Açıklama</th>
                            <th>Müşteri</th>
                            <th>Oluşturulma</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service, index) => (
                            <tr key={service.id}>
                                <td>{index + 1}</td>
                                <td>{service.title}</td>
                                <td>
                                    {service.description?.length > 60
                                        ? service.description.slice(0, 60) + "..."
                                        : service.description || "-"}
                                </td>
                                <td>
                                    {customers.find(c => c.id === service.customerId)?.company || "—"}
                                </td>
                                <td>
                                    {service.createdDate
                                        ? new Date(service.createdDate).toLocaleDateString("tr-TR")
                                        : "-"}
                                </td>
                                <td>
                                    <div className="d-flex gap-2">
                                        <Link to={`/service/${service.id}`}>
                                            <Button variant="outline-secondary" size="sm">
                                                Görüntüle
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => deleteServiceById(service.id)}
                                        >
                                            Sil
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p className="text-center text-muted py-4">
                    Henüz herhangi bir servis bulunamadı.
                </p>
            )}
        </Container>
    );
}

export default ServicePage;
