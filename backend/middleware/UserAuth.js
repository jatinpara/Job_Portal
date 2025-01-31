import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
  const token = req.headers.token; // Extract Bearer token
  console.log(token)
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.userId = decoded.id; // Attach user ID to request object
    next();
  });
};

export default userAuth;
