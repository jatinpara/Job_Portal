import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
 
  pfp: {
    type: String,
    default:"",
    
    },
  
});

const Company = mongoose.model('Company', CompanySchema);

export default Company;
