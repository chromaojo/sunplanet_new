const jwt = require("jsonwebtoken");

const authenticateTenant = (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.tenant; // If stored in a cookie

        // OR retrieve token from Authorization header (if using Bearer token)
        // const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach investor data to the request object
        req.tenant = decoded;

        next(); // Pass control to the next middleware/controller
    } catch (error) {
        console.log("The error is ", error)
        return res.status(401).json({ msg: "Invalid Token" });
    }
};

module.exports = authenticateTenant;
