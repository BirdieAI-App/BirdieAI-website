import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,  process.env.JWT_SIGNING_SECRET, (err, decoded)=>{
            if(err){
                return res.status(401).json({redirect: true, url: `${process.env.FRONTEND_URL}/api/auth/signin`})
            }
            req.user = decoded;
            next();
        });
    }else{
        return res.status(401).json({redirect: true, url: `${process.env.FRONTEND_URL}/api/auth/signin`})
    }
};

export default authenticateJWT;