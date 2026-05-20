import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripList from './pages/TripList';
import TripDetail from './pages/TripDetail';
import TripForm from './pages/TripForm';
import ActivityForm from './pages/ActivityForm';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#060c1a]">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/trips" element={
              <ProtectedRoute>
                <TripList />
              </ProtectedRoute>
            } />
            
            <Route path="/trips/new" element={
              <ProtectedRoute>
                <TripForm />
              </ProtectedRoute>
            } />
            
            <Route path="/trips/:id" element={
              <ProtectedRoute>
                <TripDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/trips/:id/edit" element={
              <ProtectedRoute>
                <TripForm />
              </ProtectedRoute>
            } />
            
            <Route path="/trips/:tripId/activities/new" element={
              <ProtectedRoute>
                <ActivityForm />
              </ProtectedRoute>
            } />
            
            <Route path="/trips/:tripId/activities/:activityId/edit" element={
              <ProtectedRoute>
                <ActivityForm />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
