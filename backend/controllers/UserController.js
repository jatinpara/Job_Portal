import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Application from '../models/ApplicationModel.js';
import cloudinary from '../config/cloudinaryConfig.js';
// Register User
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token
    res.status(201).json({ token });
  } catch (error) {
    console.error("Registration error:", error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token
    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};




export const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
   const pfp =req.file
    // Upload image to Cloudinary
  
    const result = await cloudinary.uploader.upload(pfp.path);
    
    // Update user's profile picture in the database
    const user = await User.findByIdAndUpdate(
      req.userId,
      { pfp: result.secure_url },

    );

    res.status(200).json({ message: "Profile picture updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfilePicture = async (req, res) => {
  try {
    // Find the user by their user ID (assuming it's available in the request)
    const user = await User.findById(req.userId);

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user's profile picture URL
    res.status(200).json({ pfp: user.pfp });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateResume = async (req, res) => {
  try {
    // Check if file is received
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log(req.file)
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
    });
console.log(result)
    // Return the URL of the uploaded file
    return res.status(200).json({ resumeUrl: result.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return res.status(500).json({ message: 'Error uploading file' });
  }
};

export const getResume = async (req, res) => {
  try {
    // Find the user by their ID (assuming userId is in req.userId from authentication middleware)
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If resume exists, send the URL back
    if (user.resume) {
      return res.status(200).json({ resumeUrl: user.resume });
    }

    // If resume does not exist
    return res.status(404).json({ message: "Resume not found" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getApplicationsForUser = async (req, res) => {
  try {
    // Find all applications where the userId matches req.userId
    const applications = await Application.find({ userId: req.userId })
      .populate({
        path: 'jobId', // Populate the jobId field in Application
        select: 'title location', // Only select title and location from Job
        populate: {
          path: 'companyId', // Populate the companyId in Job
          select: 'name pfp', // Only select name and pfp from Company
        },
      })
      .select('status appliedAt'); // Select status and appliedAt from Application model

    if (!applications.length) {
      return res.status(404).json({ message: 'No applications found for this user' });
    }

    // Map the results to a simplified response
    const result = applications.map(app => ({
      jobTitle: app.jobId.title,
      jobLocation: app.jobId.location,
      companyName: app.jobId.companyId.name,
      companyPfp: app.jobId.companyId.pfp,
      appliedAt: app.appliedAt,
      status: app.status,
    }));

    // Return the mapped results
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
