import express from 'express';
import { registerCompany, loginCompany  } from '../controllers/CompanyController.js';
import companyAuth from '../middleware/CompanyAuth.js';
import upload from '../middleware/multerConfig.js'
import { updateCompanyPfp } from '../controllers/CompanyController.js';
import { createJob,getCompanyJobs, toggleJobVisibility } from '../controllers/JobController.js';
import { getCompanyApplications, updateApplicationStatus } from '../controllers/ApplicationController.js';
const companyRouter = express.Router();


companyRouter.post('/register', registerCompany);
companyRouter.post('/login', loginCompany);

companyRouter.post('/postjobs', companyAuth, createJob);
companyRouter.get('/getcompanyjobs',companyAuth,getCompanyJobs);
companyRouter.patch('/jobs/toggle-visibility',companyAuth,toggleJobVisibility)



companyRouter.put('/update-pfp', companyAuth, upload.single('profilePicture'), updateCompanyPfp);

companyRouter.get('/applications',companyAuth,getCompanyApplications)
companyRouter.patch("/applications/update-status", companyAuth, updateApplicationStatus);

export default companyRouter;
