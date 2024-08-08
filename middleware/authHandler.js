const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

async function isAuth(req, res, next) {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.redirect("/login");
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { _id: decoded.id };
    res.locals.user = user;
    next();
  } catch (error) {
    res.clearCookie("accessToken");
    return res.redirect("/login");
  }
}

module.exports = isAuth;
