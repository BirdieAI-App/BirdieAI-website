import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, "BirdieAI",(err, user)=>{
            if(err){
                return res.redirect(`${process.env.FRONTEND_URL}/api/auth/signin`)
            }
            next();
        });
    }else{
        return res.redirect(`${process.env.FRONTEND_URL}/api/auth/signin`)
    }
};

export default authenticateJWT;