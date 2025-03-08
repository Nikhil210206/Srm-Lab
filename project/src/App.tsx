import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import SplashScreen from "./components/splashScreen";
import Login from "./pages/Login";

import StudentDashboard from "./pages/StudentDashboard";

import TeacherDashboard from "./pages/TeacherDashboard";

import { CreateTest } from "./pages/CreateTest";

import TestInterface from "./pages/TestInterface";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";

import StundentTestResults from "./pages/StundentTestResults";
import TeacherTestResults from "./pages/TeacherTestResults";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/create-test" element={<CreateTest />} />
            <Route path="/test-interface" element={<TestInterface />} />
            <Route path="/teacher-test-results" element={<TeacherTestResults />} />
            <Route path="/student-test-results" element={<StundentTestResults />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>

        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
