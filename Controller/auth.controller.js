import User from "../models/User.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// Login Functionalties (Pending)

const login = async (req, res) => {
    const { email, password } = req.body;
    
    

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
 

        const isMatch = await bcrypt.compare(password, user.password);
  

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // if (!process.env.JWT_SECRET) {
        //     throw new Error("JWT_SECRET is not defined in the environment");
        // }

        const token = jwt.sign(
            {
                id: user._id,
                email:user.email,
                role: user.role
            },
            // process.env.JWT_SECRET,
            "#&*@##$#",
            { expiresIn: "4h" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name : user.name
            },
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

// Signup Functionalities (Solved)

const signup = async (req, res) => {

    const { name, email, password } = req.body;


    if ([name, email, password].some((item) => !item || item.trim() === "")) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }
    try {
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 5);

        const newUser = new User(
            {
                name, email, password: hashPassword

            });
        


     await newUser.save();

        res.status(201).json({
            success: true,
            message: "Registered Successfully",
        });
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Issue",
        });
    }
};

export default { login, signup }