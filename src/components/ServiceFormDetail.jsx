import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getServiceById, updateServiceSignature } from "../redux/serviceSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Card,
    Spinner,
    Badge,
    Button,
    Alert,
} from "react-bootstrap";
import SignatureCanvas from "./SignatureCanvas";
import axiosInstance from "../api/axiosInstance";

function ServiceFormDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { service, isLoading, error } = useSelector(
        (state) => state.service
    );

    const [customerSignatureSuccess, setCustomerSignatureSuccess] = useState(false);
    const [technicianSignatureSuccess, setTechnicianSignatureSuccess] = useState(false);
    const [signatureError, setSignatureError] = useState("");
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    useEffect(() => {
        if (id) dispatch(getServiceById(id));
    }, [dispatch, id]);

    const customer = service?.customer;

    const handleSaveCustomerSignature = async (signatureData) => {
        try {
            setSignatureError("");
            await dispatch(
                updateServiceSignature({
                    id,
                    customerSignature: signatureData,
                })
            ).unwrap();

            setCustomerSignatureSuccess(true);
            setTimeout(() => setCustomerSignatureSuccess(false), 3000);
            dispatch(getServiceById(id));
        } catch {
            setSignatureError("Müşteri imzası kaydedilirken hata oluştu.");
        }
    };

    const handleSaveTechnicianSignature = async (signatureData) => {
        try {
            setSignatureError("");
            await dispatch(
                updateServiceSignature({
                    id,
                    technicianSignature: signatureData,
                })
            ).unwrap();

            setTechnicianSignatureSuccess(true);
            setTimeout(() => setTechnicianSignatureSuccess(false), 3000);
            dispatch(getServiceById(id));
        } catch {
            setSignatureError("Teknisyen imzası kaydedilirken hata oluştu.");
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloadingPdf(true);
            const response = await axiosInstance.get(
                `/service-form/${id}/pdf/download`,
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: "application/pdf" })
            );

            const link = document.createElement("a");
            link.href = url;
            link.download = `service-form-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch {
            setSignatureError("PDF indirilirken hata oluştu.");
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex justify-content-center align-items-center py-4 premium-bg">
            <Card className="shadow-lg border-0 premium-card p-4 w-100" style={{ maxWidth: 794 }}>
                {isLoading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <Alert variant="danger" className="premium-alert">Servis bilgisi alınamadı.</Alert>
                ) : !service ? (
                    <Alert variant="warning" className="premium-alert">Servis bulunamadı.</Alert>
                ) : (
                    <>


                        {/* Müşteri Bilgileri */}
                        <div className="mb-4 p-4 border rounded premium-card">
                            <h5 className="fw-bold text-accent mb-3">MÜŞTERİ BİLGİLERİ</h5>
                            <div className="row">
                                <div className="col-md-6">
                                    <div><strong>Firma:</strong> {customer?.company || "-"}</div>
                                    <div><strong>Yetkili:</strong> {customer?.name || "-"}</div>
                                    <div><strong>Oluşturulma Tarihi:</strong> {new Date(service.createdDate).toLocaleDateString("tr-TR")}</div>
                                </div>
                                <div className="col-md-6">
                                    <div><strong>Telefon:</strong> {customer?.phone || "-"}</div>
                                    <div><strong>Email:</strong> {customer?.email || "-"}</div>
                                    <div><strong>Adres:</strong> {customer?.address || "-"}</div>
                                </div>
                            </div>
                        </div>

                        {/* Servis Bilgileri */}
                        <div className="mb-4 p-4 border rounded premium-card">
                            <h5 className="fw-bold text-accent mb-3">SERVİS BİLGİLERİ</h5>
                            {(service.machineType || service.machineSerialNumber || service.workingHours) && (
                                <div className="my-3">
                                    <strong>Makine Bilgileri</strong>
                                    <div className="row mt-2">
                                        {service.machineType && <div className="col-md-4">{service.machineType}</div>}
                                        {service.machineSerialNumber && <div className="col-md-4">{service.machineSerialNumber}</div>}
                                        {service.workingHours && <div className="col-md-4">{service.workingHours} saat</div>}
                                    </div>
                                </div>
                            )}
                            <div><strong>Başlık:</strong> {service.title}</div>
                            <div><strong>Açıklama:</strong> {service.description || "Yok"}</div>


                            {service.usedParts?.length > 0 && (
                                <div className="mt-3">
                                    <strong>Kullanılan Malzemeler</strong>
                                    <div className="row mt-2">
                                        {service.usedParts.map((part, i) => (
                                            <div key={i} className="col-md-6 mb-2">
                                                <div className="d-flex justify-content-between p-2 bg-light rounded shadow-sm">
                                                    <span>{part}</span>
                                                    <Badge bg="primary">{service.usedPartQuantities?.[i] || 1} adet</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* İmzalar */}
                        {signatureError && <Alert variant="danger" className="premium-alert">{signatureError}</Alert>}

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <h6 className="text-accent fw-semibold mb-2">MÜŞTERİ İMZASI</h6>
                                {service.customerSignatureUrl ? (
                                    <img src={service.customerSignatureUrl} className="img-fluid border rounded shadow-sm" />
                                ) : (
                                    <SignatureCanvas onSave={handleSaveCustomerSignature} />
                                )}
                            </div>

                            <div className="col-md-6">
                                <h6 className="text-accent fw-semibold mb-2">TEKNİSYEN İMZASI</h6>
                                {service.technicianSignatureUrl ? (
                                    <img src={service.technicianSignatureUrl} className="img-fluid border rounded shadow-sm" />
                                ) : (
                                    <SignatureCanvas onSave={handleSaveTechnicianSignature} />
                                )}
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="row mt-4 g-2">
                            <div className="col-6">
                                <Button
                                    className="w-100 premium-btn"
                                    onClick={handleDownloadPdf}
                                    disabled={isDownloadingPdf}
                                >
                                    PDF İndir
                                </Button>
                            </div>
                            <div className="col-6">
                                <Button
                                    variant="outline-primary"
                                    className="w-100 bg-white text-primary border-0 shadow-sm"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Dashboard’a Dön
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </Card>
        </Container>

    );
}

export default ServiceFormDetail;
