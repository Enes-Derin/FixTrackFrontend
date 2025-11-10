import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCustomer, getCustomers } from "../redux/customesSlice";
import { Link } from "react-router-dom";
import { Table, Button, Spinner, Alert, Container, Row, Col } from "react-bootstrap";

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
        <Container fluid className="p-4">
            <Row className="align-items-center mb-4">
                <Col>
                    <h3 className="fw-bold text-dark">🧾 Müşteri Listesi</h3>
                    <p className="text-muted mb-0">Tüm müşterilerinizi buradan görüntüleyebilir, düzenleyebilir veya silebilirsiniz.</p>
                </Col>
                <Col className="text-end">
                    <Link to="/createCustomer">
                        <Button variant="success" size="sm">
                            + Yeni Müşteri
                        </Button>
                    </Link>
                </Col>
            </Row>

            {isLoading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}

            {!isLoading && customers.length === 0 && (
                <div className="text-center text-muted my-5">
                    Henüz müşteri bulunmuyor.
                </div>
            )}

            {customers.length > 0 && (
                <div className="table-responsive">
                    <Table striped bordered hover size="sm" className="align-middle shadow-sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Ad Soyad</th>
                                <th>E-posta</th>
                                <th>Telefon</th>
                                <th className="text-center">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td className="text-center">
                                        <div className="d-flex justify-content-center gap-2">
                                            <Link to={`/customerUpdate/${customer.id}`}>
                                                <Button variant="outline-primary" size="sm">
                                                    Düzenle
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => deleteCustomerById(customer.id)}
                                            >
                                                Sil
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </Container>
    );
}

export default CustomersPage;
