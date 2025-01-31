import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import userRouter from './routes/UserRoutes.js';
import companyRouter from './routes/CompanyRoutes.js';
const app = express();

const PORT = process.env.PORT || 4000;

await connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
    res.send("hello");
});


 
// Use user routes
app.use('/api/users', userRouter);

// Use company routes
app.use('/api/companies', companyRouter);

// Use application routes


// Use job routes
 // Add job routes

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
