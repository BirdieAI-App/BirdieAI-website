import jwt from 'jsonwebtoken';
import { redirectFrontend } from '../routes/util.js';

const authenticateJWT = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token,  process.env.JWT_SIGNING_SECRET, (err, decoded)=>{
            if(err){
                return redirectFrontend(`${process.env.FRONTEND_URL}/api/auth/signin`, req, res)
            }
            req.user = decoded;
            next();
        });
    }else{
        return redirectFrontend(`${process.env.FRONTEND_URL}/api/auth/signin`, req, res)
    }
};

export default authenticateJWT;