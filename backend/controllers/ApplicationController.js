import Application from "../models/ApplicationModel.js";
import Job from "../models/JobModel.js";

export const getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.companyId; // Get companyId from auth middleware

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Step 1: Find all job IDs posted by this company
    const jobs = await Job.find({ companyId }).select("_id");
    if (jobs.length === 0) {
      return res.status(200).json({ message: "No jobs found for this company", applications: [] });
    }

    const jobIds = jobs.map(job => job._id);

    // Step 2: Find all applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name resume")  // Fetch user's name and resume
      .populate("jobId", "title location") // Fetch job title and location
      .select("_id status userId jobId"); // Select only necessary fields

    // Step 3: Format the response
    const formattedApplications = applications.map(app => ({
      applicationId: app._id, 
      userName: app.userId?.name || "Unknown",
      jobTitle: app.jobId?.title || "Unknown",
      location: app.jobId?.location || "Unknown",
      resume: app.userId?.resume || "Not Provided",
      status: app.status,
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body; // Receive application ID and new status
    const companyId = req.companyId; // Get companyId from auth middleware
    
    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Ensure status is either 'Accepted' or 'Rejected'
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the application and ensure the job belongs to the logged-in company
    const application = await Application.findById(applicationId).populate("jobId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.jobId.companyId.toString() !== companyId) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    // Update the status
    application.status = status;
    await application.save();

    res.status(200).json({ message: "Application status updated", status: application.status });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const applyForJob = async (req, res) => {
  const { jobId } = req.params;  // Get jobId from URL params
  const userId = req.userId;  // Get userId from headers (ensure userId is sent in headers)

  try {
    // Step 1: Check if the user has already applied for this job
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job.' });
    }

    // Step 2: Create a new application entry
    const newApplication = new Application({
      jobId,
      userId,
      status: 'Pending',  // Default status is 'Pending'
    });

    await newApplication.save();

    // Step 3: Increment the 'applications' count of the job
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applications: 1 },  // Increment the applications count by 1
    });

    return res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
