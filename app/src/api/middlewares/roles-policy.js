import {Role} from '../middlewares/roles';

export const isAdmin = (req, res, next) => {
    if (req.user.role !== Role.ADMIN) {
        return res.json({err: 'Unauthorized, user is not an admin'});
    }
    next();
};
