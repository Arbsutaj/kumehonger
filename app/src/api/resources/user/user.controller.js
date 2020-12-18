import userService from './user.service';
import User from './user.model';
import {
    isValidObjectId, returnExceptionResponse,
    returnInternalExceptionResponse,
    returnOkResponse
} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async signUp(req, res) {
        try {
            const {value, error} = await userService.validateSignUpRequest(req.body);
            if (error)
                return res.status(400).json(error);

            const {emailIsAlreadyUsed, exception} = await userService.isEmailAlreadyBeingUsed(value.email);
            if (emailIsAlreadyUsed)
                returnExceptionResponse(res, exception);

            const {user} = await userService.toEntity(value);
            const userCreated = await User.create(user);
            const {userDto} = await userService.toDto(userCreated);

            return res.json(userDto);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async findById(req, res) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                returnExceptionResponse(res, error);
            }

            const {user, exception} = await userService.findById();
            if (exception)
                returnExceptionResponse(res, exception);

            returnOkResponse(res, user);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async findAll(req, res) {
        try {
            const {isAdmin, notAuthorizedException} = await userService.checkIfUserIsAdmin(req.user);
            if (notAuthorizedException)
                returnExceptionResponse(res, notAuthorizedException);

            const {users} = await userService.findAll();

            returnOkResponse(res, users);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;
            const {userDto, notAuthorizedException, error} = await userService.update(req.user, id, req.body);

            if (notAuthorizedException || error) {
                if (error)
                    return res.status(400).json(error);

                returnExceptionResponse(res, notAuthorizedException);
            }

            returnOkResponse(res, userDto);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async deactivateUser(req, res) {
        try {
            const {id} = req.params;

            const {deactivatedUserDto, notAuthorizedException, notFoundException} = await userService.deactivateUser(id, req.user, req.body);
            if (notFoundException || notAuthorizedException) {
                if (notFoundException)
                    returnExceptionResponse(res, notFoundException);

                returnExceptionResponse(res, notAuthorizedException);
            }

            returnOkResponse(res, deactivatedUserDto);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    }
};
