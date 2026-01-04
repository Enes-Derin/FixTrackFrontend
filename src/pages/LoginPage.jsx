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
    const { loading, error } = useSelector((state) => state.auth);

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
                    "linear-gradient(135deg, rgba(52,152,219,0.1), rgba(26,37,47,0.9))",
            }}
        >
            <Container>
                <Row className="justify-content-center">
                    <Col xs={10} sm={8} md={6} lg={4}>
                        <Card className="p-4 shadow-lg border-0">
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary">FixTrack</h2>
                                    <p className="text-muted">
                                        Teknik Servis Yönetim Sistemi
                                    </p>
                                </div>

                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={validationSchema}
                                    onSubmit={handleSubmit}
                                >
                                    {() => (
                                        <Form>
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Kullanıcı Adı
                                                </label>
                                                <Field
                                                    name="username"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="username"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Şifre</label>
                                                <Field
                                                    name="password"
                                                    type="password"
                                                    className="form-control"
                                                />
                                                <ErrorMessage
                                                    name="password"
                                                    component="div"
                                                    className="text-danger small"
                                                />
                                            </div>

                                            {error && (
                                                <Alert variant="danger" className="text-center">
                                                    {error}
                                                </Alert>
                                            )}

                                            <div className="d-grid mt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={loading}
                                                    className="fw-bold"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Spinner
                                                                animation="border"
                                                                size="sm"
                                                                className="me-2"
                                                            />
                                                            Giriş yapılıyor...
                                                        </>
                                                    ) : (
                                                        "Giriş Yap"
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                                <p className="text-center text-muted mt-4 small">
                                    © {new Date().getFullYear()} FixTrack
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
