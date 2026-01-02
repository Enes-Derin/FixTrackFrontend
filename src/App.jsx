
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import UpdateCustomer from './components/UpdateCustomer'
import CreateCustomer from './components/CreateCustomer'
import NotFoundPage from './pages/NotFoundPage'
import ServiceCreatePage from './components/ServiceCreatePage'
import ServiceFormDetail from './components/ServiceFormDetail'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path='/customerUpdate/:id' element={
          <ProtectedRoute>
            <UpdateCustomer />
          </ProtectedRoute>
        } />

        <Route path='/createCustomer' element={
          <ProtectedRoute>
            <CreateCustomer />
          </ProtectedRoute>
        } />

        <Route path="/service/add" element={
          <ProtectedRoute>
            <ServiceCreatePage />
          </ProtectedRoute>
        } />

        <Route path='/service/:id' element={
          <ProtectedRoute>
            <ServiceFormDetail />
          </ProtectedRoute>
        } />



        <Route path='*' element={
          <NotFoundPage />
        } />
      </Routes>
      <div
        className="text-center mt-4 small fixed-bottom mb-2"
        style={{
          color: "var(--muted)",
          textShadow: "0 1px 2px rgba(0,0,0,0.1)",
        }}
      >
        © {new Date().getFullYear()} FixTrack Teknik Servis - Tüm hakları saklıdır.
      </div>

    </BrowserRouter>
  )
}

export default App
