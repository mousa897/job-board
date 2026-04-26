import jwt from "jsonwebtoken";

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role }, // payload — what we store inside the token
    process.env.JWT_SECRET, // secret key used to sign it
    { expiresIn: "7d" }, // token expires in 7 days
  );
};

export default generateToken;
