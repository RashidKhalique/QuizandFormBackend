import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({
                message: "No Token Access Denied",
            });
        }

        try {
            const decode = jwt.verify(token, "#&*@##$#");
            req.user = decode; 
            next();
        } catch (err) {
            return res.status(401).json({
                message: "Token is not valid",
            });
        }
    } else {
        return res.status(401).json({
            message: "No Token Access Denied",
        });
    }
};

export default verifyToken;



// - Rashid Khalique (Mern Stack Modification Project Auth middlewear) All are Modified of Midddlewear Folder
