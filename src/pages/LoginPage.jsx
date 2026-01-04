import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";
import * as Yup from "yup";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Spinner,
    Alert,
} from "react-bootstrap";

function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const initialValues = {
        username: "",
        password: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Kullanıcı adı zorunlu"),
        password: Yup.string().required("Şifre zorunlu"),
    });

    const handleSubmit = async (values) => {
        const resultAction = await dispatch(loginUser(values));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate("/dashboard");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center min-vh-100"
            style={{
                background:
                    "linear-gradient(135deg, rgba(52,152,219,0.1), rgba(26,37,47,0.9)), url('https://www.transparenttextures.com/patterns/concrete-wall.png')",
                backgroundSize: "cover",
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col xs={10} sm={8} md={6} lg={4}>
                        <Card
                            className="p-4 shadow-lg border-0"
                            style={{
                                borderRadius: "12px",
                                background: "var(--bg-card)",
                                backdropFilter: "blur(10px)",
                            }}
                        >
                            <Card.Body>
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary mb-2" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
                                        FixTrack
                                    </h2>
                                    <p className="text-light mb-3">
                                        Teknik Servis Yönetim Sistemi
                                    </p>
                                </div>

                                {/* Form */}
                                <Formik
                                    enableReinitialize
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {({ values }) => (
                                        <Form>
                                            {/* Username */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Kullanıcı Adı
                                                </label>
                                                <Field
                                                    name="username"
                                                    type="text"
                                                    value={values.username || ""}
                                                    className="form-control"
                                                    placeholder="Kullanıcı adınızı girin"
                                                />
                                                <ErrorMessage
                                                    name="username"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Şifre</label>
                                                <Field
                                                    name="password"
                                                    type="password"
                                                    value={values.password || ""}
                                                    className="form-control"
                                                    placeholder="Şifrenizi girin"
                                                />
                                                <ErrorMessage
                                                    name="password"
                                                    component="div"
                                                    className="text-danger small mt-1"
                                                />
                                            </div>

                                            {/* Error Alert */}
                                            {error && (
                                                <Alert
                                                    variant="danger"
                                                    className="py-2 text-center shadow-sm"
                                                >
                                                    {error}
                                                </Alert>
                                            )}

                                            {/* Submit */}
                                            <div className="d-grid mt-4">
                                                <Button
                                                    type="submit"
                                                    className="premium-btn fw-bold shadow-sm"
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" /> Giriş yapılıyor...
                                                        </>
                                                    ) : (
                                                        "🔑 Giriş Yap"
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                                {/* Footer */}
                                <p className="text-center text-light mt-4 small">
                                    © {new Date().getFullYear()} FixTrack Teknik Servis - Tüm hakları saklıdır.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default LoginPage;
