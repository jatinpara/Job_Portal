import React, { useState ,useEffect} from "react";
import RecruiterAuthModal from "./RecruiterAuthModal";
import EmployeeAuthModal from "./EmployeeAuthModal";
import { useNavigate } from "react-router-dom"; // For navigation in React Router v6
import { toast } from "react-toastify";
const Navbar = () => {
  const [showRecruiterModal, setShowRecruiterModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // useNavigate for navigation

  // Check if employee token exists in localStorage
  const employeeToken = localStorage.getItem("employeeToken");
  // Check if recruiter token exists in localStorage
  const recruiterToken = localStorage.getItem("recruiterToken");


  // Handle employee logout
  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    setShowDropdown(false);
    setShowEmployeeModal(false); 
    toast('Logged out successfully')// Close modal if open
    
    // Close modal on logout (if open)
  };

  // Handle recruiter logout
  const handleRecruiterLogout = () => {
    localStorage.removeItem("recruiterToken");
    setShowRecruiterModal(false); 
    toast('Logged out successfully')// Close modal if open
  };

  // Handle profile navigation for employee
  const handleProfile = () => {
    navigate("/user-profile"); // Navigate to the profile page using useNavigate
  };

  return (
    <header className="flex justify-between p-4 bg-white ">
      <a href="/home" className="text-xl font-bold text-blue-600">
  JobFinder
</a>

      <div className="flex items-center">
        {employeeToken ? (
          // Display Profile Picture and Dropdown Menu when logged in as employee
          <div className="relative">
            <button
  onClick={() => setShowDropdown(!showDropdown)}
  className="flex items-center space-x-2 px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none transition duration-200"
>
  <span className=" font-semibold">Profile</span>
</button>


            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={handleProfile}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : recruiterToken ? (
          // Show Logout button for recruiters if recruiter token exists
          <div className="relative">
            <button
              onClick={handleRecruiterLogout}
              className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none transition duration-200"

            >
              Recruiter Logout
            </button>
          </div>
        ) : (
          // Show login buttons if not logged in
          <>
  <button
    className="mr-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
    onClick={() => setShowRecruiterModal(true)}
  >
    Recruiter Login
  </button>
  <button
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
    onClick={() => setShowEmployeeModal(true)}
  >
    Employee Login
  </button>
</>

        )}
      </div>

      {/* Open respective modals */}
      {showRecruiterModal && (
        <RecruiterAuthModal onClose={() => setShowRecruiterModal(false)} />
      )}
      {showEmployeeModal && (
        <EmployeeAuthModal onClose={() => setShowEmployeeModal(false)} />
      )}
    </header>
  );
};

export default Navbar;
