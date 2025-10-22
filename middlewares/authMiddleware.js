import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// export const verifytoken = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ message: "Unauthorized: No token provided" });
//     }

//     // Direct token (agar tum "Bearer" nahi bhej rahe frontend se)
//     const token = authHeader;

//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decode;
//     next();

//   } catch (error) {
//     console.error("JWT Verify Error:", error.message);
//     return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
//   }
// };

export const verifytoken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Expect format: "Bearer token"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();

  } catch (error) {
    console.error("JWT Verify Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};


export const isadmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized Access"
      });
    }

    next();

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in admin middleware"
    });
  }
};
