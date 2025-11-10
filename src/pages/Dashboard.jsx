import React, { useState } from "react";
import { Navbar, Nav, Container, Offcanvas, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import CustomersPage from "./CustomersPage";
import ServicePage from "./ServicePage";
import { logoutUser } from "../redux/authSlice";

function Dashboard() {
    const dispatch = useDispatch();
    const [activePage, setActivePage] = useState("customers");
    const [showSidebar, setShowSidebar] = useState(false);

    const renderPage = () => {
        switch (activePage) {
            case "customers":
                return <CustomersPage />;
            case "services":
                return <ServicePage />;
            default:
                return <CustomersPage />;
        }
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div className="bg-light min-vh-100">
            {/* Navbar */}
            <Navbar bg="dark" variant="dark" expand="lg" className="px-3">
                <Navbar.Brand href="#">FixTrack</Navbar.Brand>
                <Button
                    variant="outline-light"
                    className="d-lg-none ms-auto"
                    onClick={() => setShowSidebar(true)}
                >
                    ☰
                </Button>
                <Navbar.Collapse className="justify-content-end">
                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                        Çıkış Yap
                    </Button>
                </Navbar.Collapse>
            </Navbar>

            <Container fluid>
                <div className="d-flex">
                    {/* Sidebar */}
                    <div className="d-none d-lg-block bg-dark text-light vh-100 p-3" style={{ width: "240px" }}>
                        <h5 className="mb-4 text-center">Menü</h5>
                        <Nav className="flex-column">
                            <Nav.Link
                                onClick={() => setActivePage("customers")}
                                active={activePage === "customers"}
                                className={`text-light ${activePage === "customers" ? "fw-bold bg-secondary rounded" : ""}`}
                            >
                                🧾 Müşteriler
                            </Nav.Link>
                            <Nav.Link
                                onClick={() => setActivePage("services")}
                                active={activePage === "services"}
                                className={`text-light ${activePage === "services" ? "fw-bold bg-secondary rounded" : ""}`}
                            >
                                🛠 Servisler
                            </Nav.Link>
                        </Nav>
                    </div>

                    {/* Mobile Sidebar */}
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} className="bg-dark text-light">
                        <Offcanvas.Header closeButton closeVariant="white">
                            <Offcanvas.Title>Menü</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className="flex-column">
                                <Nav.Link
                                    onClick={() => {
                                        setActivePage("customers");
                                        setShowSidebar(false);
                                    }}
                                    className={`text-light ${activePage === "customers" ? "fw-bold bg-secondary rounded" : ""}`}
                                >
                                    🧾 Müşteriler
                                </Nav.Link>
                                <Nav.Link
                                    onClick={() => {
                                        setActivePage("services");
                                        setShowSidebar(false);
                                    }}
                                    className={`text-light ${activePage === "services" ? "fw-bold bg-secondary rounded" : ""}`}
                                >
                                    🛠 Servisler
                                </Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Offcanvas>

                    {/* Main Content */}
                    <div className="flex-grow-1 p-4">{renderPage()}</div>
                </div>
            </Container>
        </div>
    );
}

export default Dashboard;
