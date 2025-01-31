import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import Navbar from './components/Navbar';
import CompanyDashboard from './pages/CompanyDashboard';
import { JobProvider } from './context/JobContext';
import JobDetails from './pages/JObDetails';
import UserProfile from './pages/UserProfile';
import {ToastContainer} from 'react-toastify'
const App = () => {
  return (
    <div className="px-4 lg:px-8 max-w-screen-xl mx-auto"> 

    <ToastContainer></ToastContainer>
        <JobProvider>
          <Router>
            <Layout /> {/* Separate Layout for Navbar logic */}
          </Router>
          </JobProvider>
      
    </div>
  );
};

const Layout = () => {
  const excludedRoutes = ['',];
const shouldShowNavbar = !excludedRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        <Route path='home' element={<Homepage></Homepage>}></Route>
        {/* <Route path="/company/auth" element={<CompanyAuth />} /> */}
        <Route path='job-details/:jobId' element={<JobDetails></JobDetails>}></Route>
        <Route path='user-profile' element={<UserProfile></UserProfile>}></Route>
        
        <Route path='company-dashboard' element={<CompanyDashboard></CompanyDashboard>}></Route>

      </Routes>
    </>
  );
};

export default App;
