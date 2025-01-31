import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const CompanyDashboard = () => {
    const [activeTab, setActiveTab] = useState("manage-jobs");
    const [jobs, setJobs] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const token = localStorage.getItem("recruiterToken");
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission
    const handleFileSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("profilePicture", file); // Append the file to the form data

        try {
            // Make the API request using axios
            const response = await axios.put(`${backendUrl}/api/companies/update-pfp`, formData, {
                headers: {
                    token:token, // Ensure the correct content type for file upload
                }}
            );

            // On successful upload, set success message
            setSuccessMessage(response.data.message);
            setError(null); // Clear previous error if any
        } catch (error) {
            // Handle error
            setError(error.response?.data?.message || "An error occurred");
            setSuccessMessage(null); // Clear previous success message if any
        }
    };

    const [jobForm, setJobForm] = useState({
        title: "",
        location: "",
        position: "",
        description: "",
        salary: "",
        yearsOfExperience: "",
        jobType: "Internship",
    });



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };


    const [applications, setApplications] = useState([]);

    useEffect(() => {
        if (activeTab === "view-applications") {
            fetchApplications();
        }
    }, [activeTab]); // 👈 Add `applications` dependency


    const fetchApplications = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/companies/applications`, { headers: { token: token } });
            setApplications(response.data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        }
    };

    const updateStatus = async (applicationId, status) => {
        if (!applicationId) {
            toast.error("Application ID is undefined", { autoClose: 3000 });
            return;
        }

        const application = applications.find(app => app._id === applicationId);
        if (application && application.status !== "Pending") {
            toast.warn("Application has already been processed", { autoClose: 3000 });
            return;
        }

        try {
            await axios.patch(
                `${backendUrl}/api/companies/applications/update-status`,
                { applicationId, status },
                { headers: { token: token } }
            );

            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? { ...app, status } : app
                )
            );

            // ✅ Success toast
            toast.success(`Application ${status} successfully!`, { autoClose: 3000 });
            await fetchApplications(); // Call it manually AFTER updating status

        } catch (error) {
            // ✅ Error toast
            toast.error("Error updating status. Please try again.", { autoClose: 3000 });
        }
    };




    useEffect(() => {
        // Check if either employeeToken or recruiterToken exists
        if (!localStorage.getItem("recruiterToken")) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${backendUrl}/api/companies/postjobs`,
                jobForm,
                {
                    headers: {
                        token: token,
                    },
                }
            );
            if (response.status === 201) {
                toast("Job created successfully!");
                // Optionally reset form or redirect
                setJobForm({
                    title: "",
                    location: "",
                    position: "",
                    description: "",
                    salary: "",
                    yearsOfExperience: "",
                    jobType: "Internship",
                });
            }
        } catch (error) {
            console.error("Error creating job:", error);
            alert("Failed to create job.");
        }
    };


    // Fetch company jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/companies/getcompanyjobs`, {
                    headers: { token: token },
                });
                setJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);

    const handleToggleVisibility = async (jobId, currentVisibility) => {
        try {
            const response = await axios.patch(
                `${backendUrl}/api/companies/jobs/toggle-visibility`,
                { jobId },
                {
                    headers: {
                        token: token,
                    },
                }
            );

            // Update visibility locally if successful
            if (response.status === 200) {
                setJobs((prevJobs) =>
                    prevJobs.map((job) =>
                        job._id === jobId ? { ...job, visible: !currentVisibility } : job
                    )
                );
            }
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };




    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            {/* Sidebar */}
            <aside className="w-full sm:w-1/5 p-5 border-r sm:block flex flex-col sm:space-y-4 space-y-2">
                {/* Logo */}


                {/* Navigation */}
                <nav className="flex flex-col space-y-4">
                    <button
                        className={`p-3 text-left ${activeTab === "manage-jobs" ? "bg-blue-600 text-white" : "text-gray-700"
                            } rounded-lg`}
                        onClick={() => setActiveTab("manage-jobs")}
                    >
                        Manage Jobs
                    </button>

                    <button
                        className={`p-3 text-left ${activeTab === "add-job" ? "bg-blue-500 text-white" : "text-gray-700"
                            } rounded-lg`}
                        onClick={() => setActiveTab("add-job")}
                    >
                        Add Job
                    </button>

                    <button
                        className={`p-3 text-left ${activeTab === "view-applications" ? "bg-blue-500 text-white" : "text-gray-700"
                            } rounded-lg`}
                        onClick={() => setActiveTab("view-applications")}
                    >
                        View Applications
                    </button>
                </nav>
            </aside>


            {/* Main Content */}
            <div className="w-4/5 p-6">
                {/* Navbar */}
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-semibold">
                        {activeTab === "manage-jobs" && "Manage Job Posts"}
                        {activeTab === "add-job" && "Add New Job"}
                        {activeTab === "view-applications" && "View Applications"}
                    </h2>

                </div>

                {activeTab === "manage-jobs" && (
                    <div className="mt-6 bg-white shadow-md rounded-lg border overflow-x-auto">
                        <table className="w-full bg-white">
                            <thead>
                                <tr className="border-b text-left text-sm text-gray-500">
                                    <th className="px-4 py-4">#</th>
                                    <th className="px-4 py-4">Job Title</th>
                                    <th className="px-4 py-4">Date</th>
                                    <th className="px-4 py-4">Location</th>
                                    <th className="px-4 py-4">Applicants</th>
                                    <th className="px-4 py-4">Visible</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length > 0 ? (
                                    jobs.map((job, index) => (
                                        <tr key={job._id} className="border-b text-gray-700 hover:bg-gray-50">
                                            <td className="px-4 py-4">{index + 1}</td>
                                            <td className="px-4 py-4">{job.title}</td>
                                            <td className="px-4 py-4">{new Date(job.createdAt).toDateString()}</td>
                                            <td className="px-4 py-4">{job.location}</td>
                                            <td className="px-4 py-4">{job.applications}</td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={job.visible}
                                                    onChange={() => handleToggleVisibility(job._id, job.visible)}
                                                    className="cursor-pointer"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                            No jobs found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}



                {activeTab === "add-job" && (
                    <div className="min-h-screen  p-6 flex ">
                        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-sm">
                            <h3 className=" text-blue-600 text-2xl font-semibold mb-4 text-center">Create New Job</h3>
                            <div className="mb-10 p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
  <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Profile Picture</h2>
  <form onSubmit={handleFileSubmit} className="space-y-4">
    <div>
      <label htmlFor="profilePicture" className="block text-gray-700 font-medium">
        Choose a profile picture
      </label>
      <input
        type="file"
        id="profilePicture"
        name="profilePicture"
        onChange={handleFileChange}
        accept="image/*"
        className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
      />
    </div>
    
    <button
      type="submit"
      className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-300"
    >
      Upload
    </button>
  </form>

  {successMessage && (
    <p className="mt-4 text-green-600 font-semibold">{successMessage}</p>
  )}
  {error && (
    <p className="mt-4 text-red-600 font-semibold">{error}</p>
  )}
</div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Job Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={jobForm.title}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                        Job Description
                                    </label>
                                    <ReactQuill
                                        theme="snow"
                                        value={jobForm.description}
                                        onChange={(value) => setJobForm({ ...jobForm, description: value })}
                                        className="mt-1 bg-white"
                                    />

                                </div>

                                {/* Grid Layout for Multiple Fields */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    {/* Job Location */}
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={jobForm.location}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Job Position */}
                                    <div>
                                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                                            Position
                                        </label>
                                        <input
                                            type="text"
                                            id="position"
                                            name="position"
                                            value={jobForm.position}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    {/* Job Type */}
                                    <div>
                                        <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                                            Job Type
                                        </label>
                                        <select
                                            id="jobType"
                                            name="jobType"
                                            value={jobForm.jobType}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="Internship">Internship</option>
                                            <option value="Job">Job</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Grid Layout for Salary & Experience */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {/* Salary */}
                                    <div>
                                        <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                                            Salary
                                        </label>
                                        <input
                                            type="number"
                                            id="salary"
                                            name="salary"
                                            value={jobForm.salary}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    {/* Years of Experience */}
                                    <div>
                                        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                                            Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            id="yearsOfExperience"
                                            name="yearsOfExperience"
                                            value={jobForm.yearsOfExperience}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Create Job
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}





                {activeTab === "view-applications" && (
                    <div className="mx-auto max-w-6xl p-6">
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full bg-white">
                                <thead>
                                    <tr className="border-b text-left text-sm text-gray-500">
                                        <th className="px-4 py-4">User Name</th>
                                        <th className="px-4 py-4">Job Title</th>
                                        <th className="px-4 py-4">Location</th>
                                        <th className="px-4 py-4">Resume</th>
                                        <th className="px-4 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                                No applications found
                                            </td>
                                        </tr>
                                    ) : (
                                        applications.map((app, idx) => (
                                            <tr key={app.applicationId || idx} className="border-b last:border-0">
                                                <td className="px-4 py-4 flex items-center gap-2">
                                                    <img
                                                        src={app.userPfp}
                                                        alt={app.userName}
                                                        className="h-8 w-8 rounded-full"
                                                    />
                                                    <span className="font-medium">{app.userName}</span>
                                                </td>
                                                <td className="px-4 py-4">{app.jobTitle}</td>
                                                <td className="px-4 py-4">{app.location}</td>
                                                <td className="px-4 py-4">
                                                    <a
                                                        href={app.resume}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Download
                                                    </a>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-sm ${app.status === "Accepted"
                                                            ? "bg-green-100 text-green-600"
                                                            : app.status === "Rejected"
                                                                ? "bg-red-100 text-red-600"
                                                                : "bg-blue-100 text-blue-600"
                                                            }`}
                                                    >
                                                        {app.status}
                                                    </span>
                                                    <div className="mt-2 flex space-x-2">
                                                        <button
                                                            className="text-green-600 hover:text-green-800"
                                                            onClick={() => updateStatus(app.applicationId, "Accepted")}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => updateStatus(app.applicationId, "Rejected")}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}








            </div>
        </div>
    );
};

export default CompanyDashboard;
