import passport from "passport";

const config = {
  production: {
    secret: process.env.secret,
    MONGO_URI: process.env.MONGO_URI,
    port: process.env.PORT,
  },
  development: {
    secret: 'I_AME_GERER',
    MONGO_URI: 'mongodb://localhost/kumehonger',
    port: 3000,

  },
};

export const authentication = {
  strategy: 'jwt',
  isAuthenticated() {
    return passport.authenticate(authentication.strategy, {session: false});
  }
};

export const getConfig = env => config[env] || config.development;
