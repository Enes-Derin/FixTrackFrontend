import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addService, updateServiceSignature } from "../redux/serviceSlice";
import { getCustomers } from "../redux/customesSlice";
import {
    Container,
    Card,
    Form,
    Button,
    Spinner,
    Alert,
    Row,
    Col,
} from "react-bootstrap";
import SignatureCanvas from "./SignatureCanvas";

function ServiceCreatePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [customerSignature, setCustomerSignature] = useState(null);
    const [technicianSignature, setTechnicianSignature] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


    const [machineType, setMachineType] = useState("");
    const [machineSerialNumber, setMachineSerialNumber] = useState("");
    const [workingHours, setWorkingHours] = useState("");
    const [usedParts, setUsedParts] = useState([""]);
    const [usedPartQuantities, setUsedPartQuantities] = useState([1]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { customers, isLoading, error } = useSelector(
        (state) => state.customer
    );

    useEffect(() => {
        dispatch(getCustomers());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!title.trim() || !description.trim() || !customerId) {
            setErrorMessage("Lütfen tüm zorunlu alanları doldurun.");
            return;
        }


        setIsSubmitting(true);
        try {
            const serviceData = {
                title: title.trim(),
                description: description.trim(),
                customerId: parseInt(customerId),
                machineType: machineType.trim(),
                machineSerialNumber: machineSerialNumber.trim(),
                workingHours: workingHours ? parseInt(workingHours) : null,
                usedParts: usedParts.filter(part => part && part.trim() !== ""),
                usedPartQuantities: usedPartQuantities.filter((qty, index) => usedParts[index] && usedParts[index].trim() !== ""),

                customerSignature: "",
                technicianSignature: ""
            };

            const createdService = await dispatch(
                addService(serviceData)
            ).unwrap();
            if (createdService.id && (customerSignature || technicianSignature)) {
                await dispatch(updateServiceSignature({
                    id: createdService.id,
                    customerSignature: customerSignature || null,
                    technicianSignature: technicianSignature || null
                })).unwrap();
            }

            setSuccessMessage("Servis başarıyla oluşturuldu!");
            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
        } catch (err) {
            console.error("Servis oluşturma hatası:", err);

            if (err.response?.status === 401 || err.isAuthError) {
                setErrorMessage(err.message || "Oturumunuz sona erdi. Lütfen tekrar giriş yapın.");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setErrorMessage("Servis oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container fluid className="min-vh-100 d-flex align-items-center py-4 premium-bg">
            <Card className="shadow-lg border-0 mx-auto w-100 premium-card" style={{ maxWidth: "900px" }}>
                <Card.Body className="p-4 p-md-5">
                    {/* Header */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-accent mb-2">Yeni Servis Kaydı</h2>
                        <p className="text-light small">Teknik servis formu oluşturma</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        {/* Servis Bilgileri */}
                        <div className="mb-5">
                            <h4 className="fw-bold text-accent mb-4 border-bottom pb-2">Servis Bilgileri</h4>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Servis Başlığı <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Örn: Klima Bakımı, Araç Tamiri"
                                            isInvalid={!title.trim() && errorMessage}
                                            className="premium-input"
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Servis başlığı zorunludur.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Müşteri <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={customerId}
                                            onChange={(e) => setCustomerId(e.target.value)}
                                            isInvalid={!customerId && errorMessage}
                                            className="premium-input"
                                            required
                                        >
                                            <option value="">Müşteri Seçin</option>
                                            {isLoading ? (
                                                <option disabled>Yükleniyor...</option>
                                            ) : (
                                                customers.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.company} - {c.name}
                                                    </option>
                                                ))
                                            )}
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Müşteri seçimi zorunludur.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-4">
                                <Form.Label className="fw-semibold">Servis Açıklaması <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Servis detaylarını, yapılan işlemleri ve notları buraya yazın..."
                                    isInvalid={!description.trim() && errorMessage}
                                    className="premium-input"
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Servis açıklaması zorunludur.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </div>

                        <hr className="my-4" />

                        {/* Makine Bilgileri */}
                        <div className="mb-4">
                            <h4 className="fw-bold text-accent mb-4 border-bottom pb-2">Makine Bilgileri</h4>
                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Makine Tipi</Form.Label>
                                        <Form.Control
                                            value={machineType}
                                            onChange={(e) => setMachineType(e.target.value)}
                                            placeholder="Örn: Klima, Dizel Motor"
                                            className="premium-input"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Seri Numarası</Form.Label>
                                        <Form.Control
                                            value={machineSerialNumber}
                                            onChange={(e) => setMachineSerialNumber(e.target.value)}
                                            placeholder="Makine seri numarası"
                                            className="premium-input"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Çalışma Saati</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            value={workingHours}
                                            onChange={(e) => setWorkingHours(e.target.value)}
                                            placeholder="Saat cinsinden"
                                            className="premium-input"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </div>

                        <hr className="my-4" />

                        {/* Kullanılan Parçalar */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                <h4 className="fw-bold text-accent mb-0">Kullanılan Parçalar</h4>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    className="premium-btn"
                                    onClick={() => {
                                        setUsedParts([...usedParts, ""]);
                                        setUsedPartQuantities([...usedPartQuantities, 1]);
                                    }}
                                >
                                    + Parça Ekle
                                </Button>
                            </div>

                            {usedParts.map((part, idx) => (
                                <Row className="align-items-center mb-2" key={`part-${idx}`}>
                                    <Col xs={7} sm={8} className="mb-2 mb-sm-0">
                                        <Form.Control
                                            placeholder="Parça adı"
                                            value={part}
                                            onChange={(e) => {
                                                const newParts = [...usedParts];
                                                newParts[idx] = e.target.value;
                                                setUsedParts(newParts);
                                            }}
                                            className="premium-input"
                                        />
                                    </Col>

                                    <Col xs={3} sm={2} className="mb-2 mb-sm-0">
                                        <Form.Control
                                            type="number"
                                            min={1}
                                            value={usedPartQuantities[idx] ?? 1}
                                            onChange={(e) => {
                                                const newQs = [...usedPartQuantities];
                                                newQs[idx] = parseInt(e.target.value) || 1;
                                                setUsedPartQuantities(newQs);
                                            }}
                                            className="premium-input"
                                        />
                                    </Col>

                                    <Col xs={2} sm={2} className="text-end d-flex gap-2 justify-content-end">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            className="premium-btn"
                                            onClick={() => {
                                                const newParts = usedParts.filter((_, i) => i !== idx);
                                                const newQs = usedPartQuantities.filter((_, i) => i !== idx);
                                                setUsedParts(newParts.length ? newParts : [""]);
                                                setUsedPartQuantities(newQs.length ? newQs : [1]);
                                            }}
                                        >
                                            Sil
                                        </Button>
                                    </Col>
                                </Row>
                            ))}

                            <div className="mt-3">
                                <Form.Text className="d-block text-light mt-2">
                                    Parça adı ve adeti ayrı satırlarda girin.
                                </Form.Text>
                            </div>
                        </div>

                        <hr className="my-4" />

                        {/* Dijital İmzalar */}
                        <div className="mb-5">
                            <h4 className="fw-bold text-accent mb-4 border-bottom pb-2">Dijital İmzalar</h4>
                            <p className="text-light small mb-4">
                                Aşağıdaki alanlarda müşteri ve teknisyen imzalarını toplayın.
                            </p>

                            <Row className="g-4">
                                <Col md={6}>
                                    <div className="border rounded p-3 bg-light premium-card">
                                        <h6 className="fw-semibold text-accent mb-3">Müşteri İmzası</h6>
                                        <SignatureCanvas onSave={setCustomerSignature} onClear={() => setCustomerSignature(null)} />
                                        {customerSignature && (
                                            <small className="text-success mt-2 d-block fw-semibold">✓ İmza kaydedildi</small>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="border rounded p-3 bg-light premium-card">
                                        <h6 className="fw-semibold text-accent mb-3">Teknisyen İmzası</h6>
                                        <SignatureCanvas onSave={setTechnicianSignature} onClear={() => setTechnicianSignature(null)} />
                                        {technicianSignature && (
                                            <small className="text-success mt-2 d-block fw-semibold">✓ İmza kaydedildi</small>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </div>

                        {/* Alerts */}
                        {errorMessage && (
                            <Alert variant="danger" className="mt-3 text-center premium-alert" dismissible onClose={() => setErrorMessage("")}>
                                <strong>Hata!</strong> {errorMessage}
                            </Alert>
                        )}
                        {successMessage && (
                            <Alert variant="success" className="mt-3 text-center premium-alert">
                                <strong>Başarılı!</strong> {successMessage}
                            </Alert>
                        )}
                        {error && !errorMessage && (
                            <Alert variant="warning" className="mt-3 text-center premium-alert" dismissible>
                                <strong>Uyarı!</strong> {error}
                            </Alert>
                        )}

                        {/* Submit */}
                        <div className="d-grid mt-5">
                            <Button
                                size="lg"
                                variant="primary"
                                type="submit"
                                disabled={isSubmitting || isLoading || !customerSignature || !technicianSignature}
                                className="fw-bold py-3 premium-btn shadow-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Kaydediliyor...
                                    </>
                                ) : (
                                    "Servisi Oluştur"
                                )}
                            </Button>
                        </div>

                        <div className="text-center mt-2">
                            {!customerSignature || !technicianSignature && (
                                <small className="text-danger">
                                    Hem müşteri hem teknisyen imzası kaydedilmeden form oluşturulamaz.
                                </small>
                            )}
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>

    );
}

export default ServiceCreatePage;
