import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import HomePage from './Pages/Home_Page';
import WelcomePage from "./Pages/WelcomePage";
import LandingPage from "./Pages/LandingPage";
import Dashboard from "./Components/Dashboard";
import Profile from "./Components/Profile";
import Question from "./Pages/Question";
import Chapter from "./Components/Chapter";
import { isAuthenticated } from './Utils/authorization';

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/LandingPage" replace />;
};

function App() {


return (
    
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>}>
          <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
        <Route path="/chapter/:topicSlug" element={<ProtectedRoute><Chapter /></ProtectedRoute>} />
        <Route path="/question/:TopicSlug/:ChapterName" element={<ProtectedRoute><Question /></ProtectedRoute>} />
        <Route path="/test">
          <Route index element={<Chapter asTest = {true} />} />
          <Route path=":testId" element={<div>Test ID Page</div>} />
          <Route path="ongoingTest" element={<div>Ongoing Test Page</div>} />
        </Route>
        <Route path="*" element={<div>Page Not-found</div>} />
      </Routes>
    
  );
}
export default App;
