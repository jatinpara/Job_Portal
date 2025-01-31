import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; // For navigation in React Router v6
import { toast } from 'react-toastify';
import axios from 'axios';
const UserProfile=() => {
  const [profilePic, setProfilePic] = useState(null);
  const [resume, setResume] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("employeeToken");
  const navigate = useNavigate();
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    // Check if either employeeToken or recruiterToken exists
    if (!localStorage.getItem("employeeToken"))
        {
      navigate("/home"); 
      toast.info("Please log in through Employee Sign In", {
        
        autoClose: 5000, // Toast duration in milliseconds
        hideProgressBar: true, // Optional: Hide progress bar
        closeOnClick: true, // Optional: Close on click
      });
      // Redirect to homepage
    // Show the employee authentication modal
    }
  }, [navigate]);
  // Fetch Profile Picture
const fetchProfilePicture = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/profile-picture`, {
        headers: {
          token: token, // Make sure token is correctly passed
        },
      });
      
      // Directly access the response data
      setProfilePic(response.data.pfp); // Update state with the profile picture URL
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };
  
  // Fetch Resume
  const fetchResume = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/get-resume`, {
        headers: {
          token: token, // Make sure token is correctly passed
        },
      });

      console.log("Resume Response:", response.data); // Debugging

      if (response.data && response.data.resumeUrl) {
        setResume(response.data.resumeUrl); // Use resumeUrl instead of resume
      } else {
        console.warn("No resume found in response");
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
};


  // Fetch Applications
  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/users/applications`, {
        headers: {
          token: token, // Pass the token correctly in headers
        },
      });
      
      // Access the response data directly
      setApplications(response.data); // Store the applications data in state
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    // Fetch profile picture
    fetchProfilePicture();
    // Fetch resume
    fetchResume();
    // Fetch applications
    fetchApplications();
  }, []);
  
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle File Upload for Profile Picture
  const handlePfpUpload = async (event) => {
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/upload-pfp`, 
        formData,
        {
          headers: {
            token: token, // Pass the token correctly in headers
          },
        }
      );

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      // If status is 200, show success toast
      if (response.status === 200) {
        toast.success("Profile picture updated successfully!", {
          autoClose: 5000, 
        });

        // Optionally update the profile picture state if user data exists
        if (response.data.user?.pfp) {
          setProfilePic(response.data.user.pfp);
        }
      }

    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to update profile picture. Try again.");
    }
};

  

  const handleResumeUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const response = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        {
          headers: {
            token: token, // Pass the token correctly in headers
          },
        }
      );

      if (response.data.resume) {
        setResume(response.data.resume); // Update resume URL
        setSelectedFile(null); // Reset file input
        alert("Resume uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading resume:", error.response?.data || error.message);
    }
  };
  

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Resume Section */}
      <div className="mb-8">
  <h2 className="mb-4 text-lg font-medium">Your Resume</h2>
  <div className="flex gap-2 items-center">
    {resume ? (
      <>
        {/* Download Button */}
        <a 
  href={`${resume}?fl_attachment=true`}  
  download="My_Resume.pdf"  // Renaming the file before downloading
  className="rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
>
  Download Resume
</a>



      </>
    ) : (
      <span className="text-sm text-gray-500">No resume uploaded</span>
    )}

<div className="space-y-3">
      {/* File Input */}
      <input
        type="file"
        accept=".pdf, .doc, .docx"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700"
      />

      {/* Upload Button */}
      <button
        onClick={handleResumeUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={!selectedFile} // Disable if no file is selected
      >
        Upload Resume
      </button>

      
    </div>
  </div>
</div>


      {/* Profile Picture Section */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium">Your Profile Picture</h2>
        <div className="flex gap-2">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="h-16 w-16 rounded-full" />
          ) : (
            <span>No profile picture uploaded</span>
          )}
          <label className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 cursor-pointer">
            <span className="sr-only">Upload</span>↑
            <input type="file" accept="image/*" className="hidden" onChange={handlePfpUpload} />
          </label>
        </div>
      </div>

      {/* Jobs Applied Section */}
      <div>
        <h2 className="mb-4 text-lg font-medium">Jobs Applied</h2>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full bg-white">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="px-4 py-4">Company</th>
                <th className="px-4 py-4">Job Title</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.length > 0 ? (
                applications.map((app, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <img src={app.companyPfp} alt={app.companyName} className="h-8 w-8 rounded-full" />
                        <span>{app.companyName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">{app.jobTitle}</td>
                    <td className="px-4 py-4">{app.jobLocation}</td>
                    <td className="px-4 py-4">{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full px-3 py-1 text-sm ${app.status === 'Accepted' ? 'bg-green-100 text-green-600' : app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;