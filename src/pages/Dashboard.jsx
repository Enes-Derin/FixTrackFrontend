import React, { useState } from "react";
import { Navbar, Nav, Offcanvas, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CustomersPage from "./CustomersPage";
import ServicePage from "./ServicePage";
import { logoutUser } from "../redux/authSlice";

function Dashboard() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("customers");
    const [showSidebar, setShowSidebar] = useState(false);

    const renderPage = () => {
        if (activePage === "services") return <ServicePage />;
        return <CustomersPage />;
    };

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <>
            <Navbar className="shadow-sm px-3 bg-white" expand="lg">
                <Navbar.Brand className="fw-bold text-accent d-flex align-items-center">
                    <span className="me-2">🔧</span>FixTrack Teknik Servis
                </Navbar.Brand>

                <Button
                    variant="outline-secondary"
                    className="d-lg-none ms-auto"
                    onClick={() => setShowSidebar(true)}
                >
                    ☰
                </Button>

                <div className="ms-auto d-none d-lg-block">
                    <Button
                        variant="outline-primary"
                        className="bg-white text-danger border-0"
                        size="sm"
                        onClick={handleLogout}
                    >
                        Çıkış Yap
                    </Button>
                </div>
            </Navbar>

            <div className="d-flex" style={{ minHeight: "100vh" }}>
                <aside className="d-none d-lg-flex flex-column sidebar p-3">
                    <h6 className="text-uppercase small mb-3 fw-bold">
                        Menü
                    </h6>

                    <Nav className="flex-column gap-2">
                        <Nav.Link
                            onClick={() => setActivePage("customers")}
                            className={`rounded px-3 py-2 text-dark ${activePage === "customers"
                                    ? "bg-accent fw-semibold"
                                    : "hover-bg-light"
                                }`}
                        >
                            Müşteriler
                        </Nav.Link>

                        <Nav.Link
                            onClick={() => setActivePage("services")}
                            className={`rounded px-3 py-2 text-dark ${activePage === "services"
                                    ? "bg-accent fw-semibold"
                                    : "hover-bg-light"
                                }`}
                        >
                            Servisler
                        </Nav.Link>
                    </Nav>
                </aside>

                <Offcanvas
                    show={showSidebar}
                    onHide={() => setShowSidebar(false)}
                    className="bg-white"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title className="text-accent fw-bold">
                            Menü
                        </Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>
                        <Nav className="flex-column gap-3">
                            <Nav.Link
                                onClick={() => {
                                    setActivePage("customers");
                                    setShowSidebar(false);
                                }}
                                className="text-dark"
                            >
                                Müşteriler
                            </Nav.Link>

                            <Nav.Link
                                onClick={() => {
                                    setActivePage("services");
                                    setShowSidebar(false);
                                }}
                                className="text-dark"
                            >
                                Servisler
                            </Nav.Link>

                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="mt-3 custom-btn-outline"
                                onClick={handleLogout}
                            >
                                Çıkış Yap
                            </Button>
                        </Nav>
                    </Offcanvas.Body>
                </Offcanvas>

                <main className="flex-grow-1 p-4">
                    {renderPage()}
                </main>
            </div>
        </>
    );
}

export default Dashboard;
