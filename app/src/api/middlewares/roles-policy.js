import {Role} from './role';
import {authentication} from "../../config/config";
import restaurantService from "../resources/resturant/restaurant.service";
import {NotAuthorizedException} from "../resources/exception/not-authorized-exception";

export const checkIfAdmin = (req, res, next) => {
    if (req.user.role !== Role.ADMIN) {
        const exception = new NotAuthorizedException('Unauthorized, user is not an admin');
        return res.status(exception.statusCode).json(exception);
    }

    next();
};
export const isAdmin = [authentication.isAuthenticated(), checkIfAdmin];
