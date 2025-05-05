import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EditEmployee from './pages/EditEmployee';
import EmployeeDetail from './pages/EmployeeDetail';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <EmployeeList />
              </PrivateRoute>
            } />
            <Route path="/employee/add" element={
              <PrivateRoute>
                <AddEmployee />
              </PrivateRoute>
            } />
            <Route path="/employee/edit/:id" element={
              <PrivateRoute>
                <EditEmployee />
              </PrivateRoute>
            } />
            <Route path="/employee/:id" element={
              <PrivateRoute>
                <EmployeeDetail />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
};

export default App; 