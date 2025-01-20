import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,  process.env.JWT_SIGNING_SECRET, (err, decoded)=>{
            if(err){
                return res.status(403).json({ error: 'Invalid or expired token.' });
            }
            req.user = decoded;
            next();
        });
    }else{
        return res.status(401).json({ message: 'No token provided. Please log in.' });
    }
};

export default authenticateJWT;