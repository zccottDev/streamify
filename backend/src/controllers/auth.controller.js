import { upserStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken"

export async function signup(req, res) {
    const { email, password, fullName } = req.body

    try {

        if (!email || !password || !fullName) {
            return res.status(400).json({ messege: "All feelds are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ messege: "Password Must be more then 6 Characters" })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ messege: "Email already exist, Please use a different one" })
        }

        const idx = Math.floor(Math.random() * 100) + 1 // generate random number between 1 and 100
        const randomAvathar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvathar,
        })

        try {
            await upserStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic ?? ''
            })
            console.log(`Stream user created for ${newUser.fullName}`)
        } catch (error) {
            console.error("Error while creating Stream user", error)
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 24 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ sucess: true, user: newUser })
    } catch (error) {
        console.log("Error in SignUp Controller", error.message)
        res.status(500).json({ messege: "Internal Server Error" })
    }
}

export function logout(req, res) {
    res.clearCookie("jwt")
    res.status(200).json({ sucess: true, message: "Logout Successful" })
}

export async function login(req, res) {

    const { email, password } = req.body
    try {

        if (!email || !password) {
            return res.status(400).json({ message: " Email and Password are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ messege: "Invalid Email or Password" })
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ messege: "Invalid Email or Password" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 24 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ sucess: true, user: user })

    } catch (error) {
        console.log("Error in Login Controller", error.message)
        res.status(500).json({ messege: "Internal Server Error" })
    }
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body

        console.log(">>>>>>>>>>>>>", userId)

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields:[
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean)
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true })

        // update user info in steam

        try {
            await upserStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })

            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding", streamError.message)
        }

        if (!updatedUser) return res.status(404).json({ message: "User not found" })

        res.status(200).json({ success: true, user: updatedUser })
    } catch (error) {
        console.log("Error in Onboarding", error.message)
        res.status(500).json({ messege: "Internal Server Error" })
    }
}