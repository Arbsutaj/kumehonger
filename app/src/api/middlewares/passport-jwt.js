import Passport from 'passport';
import PassportJWT from 'passport-jwt';
import { getConfig } from '../../config/config';
import User from '../resources/user/user.model';

const config = getConfig(process.env.NODE_ENV);
export const configJWTStrategy = () => {
  const opts = {
    jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret,
  };
  Passport.use(
    new PassportJWT.Strategy(opts, (payload, done) => {
      User.findOne({ _id: payload.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    })
  );

  Passport.serializeUser(function(user, done) {
    done(null, user._id);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
  });

  Passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
