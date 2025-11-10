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
            style={{
                background:
                    "linear-gradient(135deg, #1f1f1f 0%, #2e2e2e 50%, #3d3d3d 100%)",
                minHeight: "100vh",
            }}
            className="d-flex justify-content-center align-items-center text-light"
        >
            <Container>
                <Row className="justify-content-center">
                    <Col xs={10} sm={8} md={6} lg={4}>
                        <Card
                            className="p-4 shadow-lg border-0"
                            style={{
                                backgroundColor: "#292929",
                                borderRadius: "12px",
                                animation: "fadeIn 0.8s ease-in-out",
                            }}
                        >
                            <Card.Body>
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-danger mb-2">FixTrack</h2>
                                    <p className="text-secondary mb-3">
                                        Hesabınıza giriş yapın
                                    </p>
                                </div>

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
                                                <label className="form-label text-light">
                                                    Kullanıcı Adı
                                                </label>
                                                <Field
                                                    name="username"
                                                    type="text"
                                                    value={values.username || ""}
                                                    className="form-control bg-dark text-light border-secondary"
                                                    placeholder="Kullanıcı adınızı girin"
                                                />
                                                <ErrorMessage
                                                    name="username"
                                                    component="div"
                                                    className="text-warning small mt-1"
                                                />
                                            </div>

                                            {/* Password */}
                                            <div className="mb-3">
                                                <label className="form-label text-light">Şifre</label>
                                                <Field
                                                    name="password"
                                                    type="password"
                                                    value={values.password || ""}
                                                    className="form-control bg-dark text-light border-secondary"
                                                    placeholder="Şifrenizi girin"
                                                />
                                                <ErrorMessage
                                                    name="password"
                                                    component="div"
                                                    className="text-warning small mt-1"
                                                />
                                            </div>

                                            {/* Error */}
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
                                                    variant="danger"
                                                    size="lg"
                                                    className="fw-bold shadow-sm"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Spinner animation="border" size="sm" /> Giriş
                                                            yapılıyor...
                                                        </>
                                                    ) : (
                                                        "Giriş Yap"
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                                {/* Footer */}
                                <p className="text-center text-secondary mt-4 small">
                                    © {new Date().getFullYear()} FixTrack Tüm hakları saklıdır.
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
