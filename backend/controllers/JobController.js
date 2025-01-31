import Job from "../models/JobModel.js";
// Controller function to create a new job
export const createJob = async (req, res) => {
  try {
    // Step 1: Get companyId from the authentication token (Assume it's added to req.companyId by middleware)
    const companyId = req.companyId;

    // Step 2: Extract job details from request body
    const { title, location, position, description, salary, yearsOfExperience, jobType } = req.body;

    // Step 3: Validate input data (You can add more checks depending on the specific requirements)
    if (!title || !location || !position || !description || !jobType) {
      return res.status(400).json({ message: 'All fields except salary and yearsOfExperience are required.' });
    }

    // Step 4: Create a new job document
    const newJob = new Job({
      companyId,
      title,
      location,
      position,
      description,
      salary,
      yearsOfExperience,
      jobType,
    });

    // Step 5: Save the new job to the database
    await newJob.save();

    // Step 6: Return the created job as a response
    res.status(201).json({
      message: 'Job created successfully',
      job: newJob,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.companyId; // Get companyId from auth middleware

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Fetch jobs posted by this company and select only required fields
    const jobs = await Job.find({ companyId }).select('title createdAt location applications visible');

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching company jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toggleJobVisibility = async (req, res) => {
  try {
    const { jobId } = req.body; // Get jobId from request body
    const companyId = req.companyId; // Get companyId from auth middleware

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the job and ensure it belongs to the logged-in company
    const job = await Job.findOne({ _id: jobId, companyId });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Toggle the visibility field
    job.visible = !job.visible;
    await job.save();

    res.status(200).json({ message: "Job visibility updated", visible: job.visible });
  } catch (error) {
    console.error("Error toggling job visibility:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller to get all jobs with company details
export const getUserJobs = async (req, res) => {
  try {
    // Fetch all jobs, populate the company info from the Company model
    const jobs = await Job.find({ visible: true }) // Optional filter for visible jobs
      .populate('companyId', 'name pfp') // Populate company name and profile picture
      .select('title location position description companyId salary yearsOfExperience jobType'); // Select specific fields

    // If no jobs found
    if (jobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found.' });
    }

    // Send response with job data
    return res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// controllers/jobController.js

// Get job details by job ID
export const getJobDetails = async (req, res) => {
  const jobId = req.params.jobId; // Get the job ID from the request parameters

  try {
    // Find the job by ID in the database
    const job = await Job.findById(jobId).populate('companyId', 'pfp name'); // Populate company details (companyId is assumed to be a reference in your Job model)

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Send the job details back as the response
    return res.status(200).json({
      title: job.title,
      companyPfp: job.companyId.pfp,
      companyName: job.companyId.name,
      location: job.location,
      description: job.description,
      salary: job.salary,
      yearsOfExperience: job.yearsOfExperience,
      jobType: job.jobType,
      createdAt: job.createdAt
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getJobsFromCompanyByJobId = async (req, res) => {
  try {
    // Step 1: Get the jobId from the request params
    const { jobId } = req.params;

    // Step 2: Find the job by its ID and populate the companyId field
    const job = await Job.findById(jobId).populate('companyId', 'name pfp');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Step 3: Find all jobs by the same companyId
    const companyId = job.companyId._id; // Get the companyId from the found job
    const currentJobs = await Job.find({ companyId, visible: true })
      .populate('companyId', 'name pfp') // Include company details like name and profile picture
      .select('title location position description companyId salary yearsOfExperience jobType');

    // Step 4: If no jobs are found for this company
    if (currentJobs.length === 0) {
      return res.status(404).json({ message: 'No jobs found for this company' });
    }

    // Step 5: Send the list of jobs along with the company details back to the frontend
    return res.status(200).json(currentJobs);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
