
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import UpdateCustomer from './components/UpdateCustomer'
import CreateCustomer from './components/CreateCustomer'
import NotFoundPage from './pages/NotFoundPage'
import ServiceCreatePage from './pages/ServiceCreatePage'
import ServiceFormDetail from './pages/ServiceFormDetail'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
    </BrowserRouter>
  )
}

export default App
