import Company from '../models/CompanyModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinary from '../config/cloudinaryConfig.js';

// Register Company
export const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company
    const newCompany = new Company({
      name,
      email,
      password: hashedPassword,
    });

    // Save company to database
    await newCompany.save();

    // Create JWT token
    const token = jwt.sign({ id: newCompany._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with token
    res.status(201).json({ token });
  } catch (error) {
    console.error("Registration error:", error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

// Login Company
export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if company exists
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Check if profile is complete
    const profileComplete = company.profileComplete;

    // Respond with token and profile status
    res.status(200).json({ token, profileComplete });
  } catch (error) {
    console.error("Login error:", error); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};



// Controller to update company profile picture
export const updateCompanyPfp = async (req, res) => {
  try {
    // Step 1: Get companyId from authentication (set in auth middleware)
    const companyId = req.companyId;

    if (!companyId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Step 2: Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Step 3: Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'company_profiles', // Store images in a specific Cloudinary folder
      use_filename: true,
      unique_filename: false,
    });

    // Step 4: Update the company profile picture in the database
    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      { profilePicture: result.secure_url }, // Store the Cloudinary image URL
      { new: true } // Return updated document
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Step 5: Return success response with updated profile picture URL
    res.status(200).json({
      message: 'Profile picture updated successfully',
      profilePicture: updatedCompany.profilePicture,
    });
  } catch (error) {
    console.error('Error updating company profile picture:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
