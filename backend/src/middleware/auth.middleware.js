import jwt from "jsonwebtoken"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({messege: "Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if(!decoded){
            return res.status(401).json({messege: "Unauthorized - token expired"});
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(401).json({messege: "Unauthorized - User not found"});
        }

        req.user =user

        next()
    } catch (error) {
        console.log("Error in Middle ware", error)
        res.status(500).json({ messege: "Internal Server Error" })
    }
}