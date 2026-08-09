import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { InterviewPage } from './pages/InterviewPage';
import { PreviousReportsPage } from './pages/PreviousReportsPage';
import { InterviewReportPage } from './pages/InterviewReportPage';
import { PersonalizedLearningRoadmapPage } from './pages/PersonalizedLearningRoadmapPage';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/interview/setup" element={<InterviewSetupPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview/:id" element={<InterviewPage />} />
            <Route path="/learning-roadmap" element={<PersonalizedLearningRoadmapPage />} />
            <Route path="/profile" element={<CandidateProfilePage />} />
            <Route path="/reports" element={<PreviousReportsPage />} />
            <Route path="/reports/:id" element={<InterviewReportPage />} />
            <Route path="/report/:id" element={<InterviewReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
