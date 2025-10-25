import jwt from "jsonwebtoken"
export const verifyToken =async (req,res,next)=>{
    try {
        const token = req.cookies.access_token;
        if(!token) return res.status(400).json("Access denied.No token provided!");
        const user = jwt.verify(token,process.env.JWT);
        req.user = user;
        next();
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }

};

export const verifyAdmin =(req,res,next)=>{
    if(!req.user || req.user.is_admin){
        return res.status(403).json("Access denied.Admin only!");
    }
    next();
}
