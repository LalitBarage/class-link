// filepath: /d:/Development/class-link/backend/middlewares/adminauth.middleware.js
const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model");
const blacklistTokenModel = require("../models/blacklistToken.model");

const adminAuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const isBlacklisted = await blacklistTokenModel.findOne({ token });

  if (isBlacklisted) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(decoded._id);

    req.admin = admin;

    return next();
  } catch (err) {
    res.status(401).send({ error: "Invalid token" });
  }
};

module.exports = adminAuthMiddleware;
