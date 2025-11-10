import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceById } from "../redux/serviceSlice";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Spinner, Badge, Button } from "react-bootstrap";
import { getCustomers } from "../redux/customesSlice";

function ServiceFormDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { service, isLoading, error } = useSelector((state) => state.service);
    const { customers } = useSelector((state) => state.customer);

    useEffect(() => {
        if (id) dispatch(getServiceById(id));
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);


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
                    maxWidth: "650px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                {isLoading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="danger" />
                    </div>
                ) : error ? (
                    <div className="text-center text-danger fw-semibold">
                        Servis bilgisi alınamadı.
                    </div>
                ) : service ? (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold text-danger mb-0">{service.title}</h4>

                        </div>

                        <p className="text-muted mb-3">
                            {service.description || "Açıklama bulunmuyor."}
                        </p>

                        <hr />

                        <div className="mb-3">
                            <p className="mb-1 fw-semibold text-dark">Müşteri:</p>
                            <p className="text-secondary mb-0">
                                {customers.find(c => c.id === service.customerId)?.company || "Bilinmiyor"}

                            </p>
                        </div>

                        <div className="mb-3">
                            <p className="mb-1 fw-semibold text-dark">Oluşturulma Tarihi:</p>
                            <p className="text-secondary mb-0">
                                {new Date(service.createdDate).toLocaleString("tr-TR") || "-"}
                            </p>
                        </div>


                        <div className="text-end mt-4">
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => navigate("/dashboard")}
                            >
                                ← Geri Dön
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-muted">Servis bulunamadı.</div>
                )}
            </Card>
        </Container>
    );
}

export default ServiceFormDetail;
