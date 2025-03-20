import jwt from "jsonwebtoken"; //  Make sure this line exists

const generateTokenAndSetCookie = (userId, role, res) => {
	const token = jwt.sign(
	  { userId, role }, 
	  process.env.JWT_SECRET, 
	  { expiresIn: "15d" }
	);
  
	res.cookie("jwt", token, {
	  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in MS
	  httpOnly: true,
	  sameSite: "strict",
	  secure: process.env.NODE_ENV !== "development",
	});
  
	return token; // Now returns token
  };
  export default generateTokenAndSetCookie;
  