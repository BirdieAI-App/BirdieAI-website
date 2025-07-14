import passport from 'passport';
import googleStrategy from './googleStrategy.js';
import localStrategy from './localStrategy.js';

const passportConfig = (app) => {

    passport.use(googleStrategy); 
    passport.use(localStrategy);
    
    app.use(passport.initialize())
}

  export default passportConfig;