import express from 'express';
import { registerUser, loginUser, updateProfilePicture, getProfilePicture, updateResume, getResume, getApplicationsForUser } from '../controllers/UserController.js';
import { getJobDetails, getJobsFromCompanyByJobId, getUserJobs } from '../controllers/JobController.js';
import userAuth from '../middleware/UserAuth.js';
import { applyForJob } from '../controllers/ApplicationController.js';
import upload from '../middleware/multerConfig.js';
const userRouter = express.Router();

// User registration and login routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);


userRouter.get('/jobs',getUserJobs)
userRouter.get('/jobs/:jobId',getJobDetails)
userRouter.get('/jobs/by-job-id/:jobId', getJobsFromCompanyByJobId);
userRouter.post('/jobs/apply/:jobId',userAuth,applyForJob)

userRouter.post('/upload-pfp', upload.single('image'),userAuth, updateProfilePicture);
userRouter.get('/profile-picture',userAuth, getProfilePicture);


userRouter.post("/update-resume", upload.single("resume"),userAuth, updateResume); 
userRouter.get('/get-resume',userAuth,getResume)

userRouter.get('/applications', userAuth,getApplicationsForUser);



export default userRouter;
