import jwt from 'jsonwebtoken';

const companyAuth = (req, res, next) => {
  const token = req.headers.token // Extract Bearer token
  console.log('Token:', token); // Log the token for debugging

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err); // Log the error for debugging
      return res.status(401).json({ message: 'Unauthorized' });
    }
    console.log('Decoded JWT:', decoded); // Log the decoded token for debugging
    req.companyId = decoded.id; // Attach company ID to request object
    next();
  });
};

export default companyAuth;

