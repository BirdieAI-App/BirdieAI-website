import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) =>{
    const token = req.headers.authorization;
    if(token){
        jwt.verify(token, "BirdieAI",(err, user)=>{
            if(err){
                return res.status(403).send('Invalid Authentication Token!!!')
            }
            next();
        });
    }else{
        return res.status(401).send("Missing authentication token!!!!")
    }
};

export default authenticateJWT;