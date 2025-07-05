const jwt = require('jsonwebtoken');
const userModel = require('./models/model'); // 👈 Import your user model

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.secret); // decoded contains { email }

    // Fetch full user details from DB
    const foundUser = await userModel.findOne({ email: decoded.email });

    if (!foundUser) {  
      return res.status(404).json({ error: 'User not found' });
    }

    // Add full user data to request
    req.user = {
           id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticateToken;
