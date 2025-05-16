require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const whiteList = ["/", "/register", "/login"];
  if (whiteList.find((item) => "/v1/api" + item === req.originalUrl)) {
    next();
  } else {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      //verify
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
          email: decoded.email,
          name: decoded.name,
          createdBy: "dohuynhtai",
        };
        //console.log("check token:", decoded);
      } catch (error) {
        return res.status(401).json({
          message: " token bị hết hạn hoặc không hợp lệ",
        });
      }

      next();
    } else {
      return res.status(401).json({
        message: "Bạn chưa truyền access token ở header hoặt token bị hết hạn",
      });
    }
  }
};

module.exports = auth;
