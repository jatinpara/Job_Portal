import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";  // To access the jobId from the URL
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function JobDetails() {
    const { jobId } = useParams();  // Get the jobId from the URL params
    const [job, setJob] = useState(null); // To store job details
    const [loading, setLoading] = useState(true); // To show loading state
    const [error, setError] = useState(null); // To handle errors
    const [similarJobs, setSimilarJobs] = useState([]); // Store similar jobs
     
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate =useNavigate()
    useEffect(() => {
      const fetchJobDetails = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/users/jobs/${jobId}`);  // Make GET request to fetch job details
          setJob(response.data);  // Set the job data

          // Fetch similar jobs from the same company using companyId
          const similarJobsResponse = await axios.get(`${backendUrl}/api/users/jobs/by-job-id/${ jobId }`);
          setSimilarJobs(similarJobsResponse.data);  // Set similar jobs
           
       
          
          setLoading(false);  // Set loading to false once data is fetched
        } catch (err) {
          console.error("Error fetching job details:", err);
          setError("Error fetching job details");
          setLoading(false);
        }
      };
  
      fetchJobDetails();  // Fetch the job details when the component mounts
    }, [jobId]);


    const handleApplyClick = () => {
        // Check if the user is logged in by looking for the token in localStorage
        const token = localStorage.getItem("employeeToken");
        if (!token) {
          // If the token doesn't exist, show the login modal
          if (!localStorage.getItem("employeeToken"))
                  {
                navigate("/home"); 
                toast.info("Please log in through Employee Sign In", {
                  
                  autoClose: 5000, // Toast duration in milliseconds
                  hideProgressBar: true, // Optional: Hide progress bar
                  closeOnClick: true, // Optional: Close on click
                });
        }} else {
          // If the user is logged in, proceed with applying
          axios
            .post(`${backendUrl}/api/users/jobs/apply/${jobId}`, {}, {
              headers: {token:token},
            })
            .then(response => {
              alert("Application submitted successfully!");
            })
            .catch(error => {
              alert("Failed to apply: " + error.response?.data?.message);
            });
        }
      };

    
  
    if (loading) {
      return <div>Loading...</div>;  // Show loading message while fetching
    }
  
    if (error) {
      return <div>{error}</div>;  // Show error message if any
    }
  
    if (!job) {   
      return <div>No job details found</div>;  // Fallback in case job is not found
    }
    const formattedDate = new Date(job.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
   
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Job Details Column */}
            <div className="lg:col-span-2">
              {/* Job Header Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 p-2">
                      {/* Render company profile image */}
                      <img
                        src={job.companyPfp || 'default-pfp.png'}
                        alt="Company"
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          {job.companyName}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          {job.location}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          {job.jobType}
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">•</span>
                          {job.yearsOfExperience}+ years
                         
                        </span>
                        <span className="flex items-center text-sm text-gray-500">
                          <span className="mr-2">CTC</span>
                          {job.salary}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                  <button
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={handleApplyClick}  // Handle apply button click
                  >
                    Apply now
                  </button>
                  <p className="mt-2 text-xs text-gray-500">{formattedDate}</p>

                  </div>
                 
                  
                </div>
                
              </div>
  
              {/* Job Description */}
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900">Job description</h2>
                <p className="mt-4 text-gray-600">{job.description}</p>
  
                
  
                <button
                    className="rounded-lg mt-6 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={handleApplyClick}  // Handle apply button click
                  >
                    Apply now
                  </button>
              </div>
            </div>
  
            {/* Similar Jobs Column */}
            <div className="lg:col-span-1">
              <h2 className="text-lg font-semibold text-gray-900">More jobs from {job.companyName}</h2>
              <div className="mt-4 space-y-4">
              {similarJobs.length === 0 ? (
            <p>No jobs found</p>
          ) : (
            similarJobs.slice(0,3).map((job) => (
              <div key={job._id} className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
                <img
                  src={job.companyId.pfp || 'company-logo.png'}
                  alt="Company"
                  className="h-10 mb-3 rounded-full object-cover"  // Rounded image for better presentation
                />
                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                <div className="flex gap-4 mt-2">
                  {/* Location and Position Section with Colorful Background */}
                  <div className="flex items-center bg-green-100 text-green-700 px-3 py-1  text-sm font-semibold">
                    {job.location}
                  </div>
                  <div className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 text-sm font-semibold">
                    {job.position}
                  </div>
                </div>
                <p className="text-gray-600 mt-3">
                                    {job.description.split(' ').slice(0, 25).join(' ')}{job.description.split(' ').length > 25 && '...'}
                                </p>
                <div className="mt-4 flex gap-3">
                  
                  <Link to={`/job-details/${job._id}`} className="border px-6 py-2 rounded-lg text-blue-600 border-blue-600 hover:bg-blue-100 transition-all">
          Learn More
        </Link>
                </div>
              </div>
            ))
          )}
              </div>
            </div>
          </div>
        </main>
  
        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 bg-white py-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Online%20Jobs%20(1)-MuwqEVjxHMO2hDpN7SHSv2Izs0ivGD.png"
                  alt="InsiderJobs"
                  className="h-8"
                />
              </div>
              <p className="text-sm text-gray-500">All right reserved. Copyright @job-portal</p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Facebook</span>f
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Twitter</span>t
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Instagram</span>i
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
  