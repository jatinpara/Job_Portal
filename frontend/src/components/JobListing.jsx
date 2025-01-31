import React, { useEffect, useState } from 'react';
import { useJobContext } from '../context/JobContext'; // Importing the context
import axios from 'axios';
import { Link } from 'react-router-dom';

const JobListing = () => {
    const { searchQuery } = useJobContext(); // Access the search query from the context
    const [jobs, setJobs] = useState([]); // To store the fetched jobs
    const [selectedFilters, setSelectedFilters] = useState({
        location: '',
        jobType: '',
        experience: '',
    }); // State to store the selected filters
    const [currentPage, setCurrentPage] = useState(1); // To track the current page
    const jobsPerPage = 6; // Number of jobs to display per page

    const backendUrl = import.meta.env.VITE_BACKEND_URL; // Your backend URL

    useEffect(() => {
        // Fetch jobs from the backend whenever the component mounts or the search/query or filters change
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/users/jobs`); // Fetch jobs from the backend
                const allJobs = response.data; // Assuming the API returns a 'data' field

                // Filter the jobs based on the search query and filters
                const filteredJobs = allJobs.filter((job) => {
                    // Search query filter
                    const matchesSearchQuery =
                        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        job.description.toLowerCase().includes(searchQuery.toLowerCase());

                    // Filter based on the selected filters
                    const matchesFilters =
                        (selectedFilters.location === '' || job.location === selectedFilters.location) &&
                        (selectedFilters.jobType === '' || job.jobType === selectedFilters.jobType) &&
                        (selectedFilters.experience === '' || job.yearsOfExperience >= selectedFilters.experience);

                    return matchesSearchQuery && matchesFilters;
                });

                

                // Set the filtered jobs to state
                setJobs(filteredJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs(); // Call the fetch function
    }, [searchQuery, selectedFilters]); // Re-fetch and filter jobs whenever the search query or filters change

    // Pagination logic
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

    // Function to handle filter changes
    const handleFilterChange = (filterType, value) => {
        setSelectedFilters((prevState) => ({
            ...prevState,
            [filterType]: value,
        }));
    };

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="flex mt-7">
            {/* Filters Section */}
            <div className="w-1/4 p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
                <h3 className="font-semibold text-2xl text-gray-800 mb-6">Filters</h3>

                {/* Location Filter */}
                <div className="mt-4">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <select
                        id="location"
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Locations</option>
                        <option value="California">California</option>
                        <option value="New York">New York</option>
                    </select>
                </div>

                {/* Job Type Filter */}
                <div className="mt-6">
                    <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
                        Job Type
                    </label>
                    <select
                        id="jobType"
                        onChange={(e) => handleFilterChange('jobType', e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Job Types</option>
                        <option value="Job">Job</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>

                {/* Experience Level Filter */}
                <div className="mt-6">
                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Experience Level
                    </label>
                    <select
                        id="experience"
                        onChange={(e) => handleFilterChange('experience', e.target.value)}
                        className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Experience Levels</option>
                        <option value="1">1+ Year</option>
                        <option value="3">3+ Years</option>
                        <option value="5">5+ Years</option>
                    </select>
                </div>


            </div>


            {/* Job Listings */}
            <div className="w-3/4 p-4">
                <h2 className="text-2xl font-semibold">All Jobs</h2>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                    {currentJobs.length === 0 ? (
                        <p>No jobs found</p>
                    ) : (
                        currentJobs.map((job) => (
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

                {/* Pagination Controls */}
                <div className="flex justify-center my-6">
                    {Array.from({ length: Math.ceil(jobs.length / jobsPerPage) }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`px-4 py-2 mx-1 border rounded-lg ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-200'}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobListing;
