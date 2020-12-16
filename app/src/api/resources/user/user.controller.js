import userService from './user.service';
import User from './user.model';
import {isValidObjectId, returnInternalException, returnOkResponse} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async signUp(req, res) {
        try {
            const {value, error} = await userService.validateSignUpRequest(req.body);
            if (error)
                return res.status(400).json(error);

            const {emailIsAlreadyUsed, exception} = await userService.isEmailAlreadyBeingUsed(value.email);
            if (emailIsAlreadyUsed)
                return res.status(exception.statusCode).json(exception.getJsonExceptionMessage());

            const {user} = await userService.toEntity(value);
            const userCreated = await User.create(user);
            const {userDto} = await userService.toDto(userCreated);

            return res.json(userDto);
        } catch (err) {
            returnInternalException(res);
        }
    },
    async findById(req, res) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return res.status(error.statusCode).json(error.getJsonBadParameterExceptionMessage());
            }

            const {user, exception} = await userService.findById();
            if (exception)
                return res.status(exception.statusCode).json(exception.getJsonNotFoundExceptionMessage());

            returnOkResponse(res, user);
        } catch (err) {
            returnInternalException(res);
        }
    },
    async findAll(req, res) {
        try {
            const {isAdmin, notAuthorizedException} = await userService.checkIfUserIsAdmin(req.user);
            if (notAuthorizedException)
                return res.status(notAuthorizedException.statusCode).json(notAuthorizedException);

            const {users} = await userService.findAll();

            returnOkResponse(res, users);
        } catch (err) {
            returnInternalException(res);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;
            const {userDto, notAuthorizedException, error} = await userService.update(req.user, id, req.body);

            if (notAuthorizedException || error) {
                if (error)
                    return res.status(400).json(error);

                return res.status(notAuthorizedException.statusCode).json(notAuthorizedException);
            }


            returnOkResponse(res, userDto);
        } catch (err) {
            console.log(err);
            returnInternalException(res);
        }
    },
    async deactivateUser(req, res) {
        try {
            const {id} = req.params;

            const {deactivatedUserDto, notAuthorizedException, notFoundException} = await userService.deactivateUser(id, req.user, req.body);
            if (notFoundException || notAuthorizedException) {
                if (notFoundException)
                    return res.status(notFoundException.statusCode).json(notFoundException.getJsonNotFoundExceptionMessage());

                return res.status(notAuthorizedException.statusCode).json(notAuthorizedException);
            }

            returnOkResponse(res, deactivatedUserDto);
        } catch (err) {
            returnInternalException(res);
        }
    }
};
