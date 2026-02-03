import jwt from 'jsonwebtoken';

const getSignInUrl = (req) => {
    const host = req?.headers?.host || '';
    if (host.includes('vercel.app')) {
        return `https://${host}/api/auth/signin`;
    }
    return `${process.env.FRONTEND_URL}/api/auth/signin`;
};

const authenticateJWT = (req, res, next) =>{
    const token = req.headers.authorization;
    const signInUrl = getSignInUrl(req);
    if(token){
        jwt.verify(token,  process.env.JWT_SIGNING_SECRET, (err, decoded)=>{
            if(err){
                return res.status(401).json({redirect: true, url: signInUrl})
            }
            req.user = decoded;
            next();
        });
    }else{
        return res.status(401).json({redirect: true, url: signInUrl})
    }
};

export default authenticateJWT;