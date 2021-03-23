import userService from './user.service';
import User from './user.model';
import {
    exceptionResponse,
    internalExceptionResponse,
    isValidObjectId,
    okResponse,
    validationExceptionResponse,
} from "../../helpers/utils";
import {BadParameterException} from "../exception/bad-parameter-exception";

export default {
    async register(req, res) {
        try {
            const userRequest = req.body;
            let userGender = 'female';
            if (userRequest.gender) {
                if (userRequest.gender === 2)
                    userGender = 'male';
            }
            const userRequestMapped = Object.assign({}, userRequest, {gender: userGender});
            const {value, error} = await userService.validateSignUpRequest(userRequestMapped);
            if (error)
                return validationExceptionResponse(res, error)

            const {emailIsAlreadyUsed, exception} = await userService.isEmailAlreadyBeingUsed(value.email);
            if (emailIsAlreadyUsed)
                return exceptionResponse(res, exception);

            const {user} = await userService.toEntity(value);
            const userCreated = await User.create(user);
            const {userDto} = userService.toDto(userCreated);

            return okResponse(res, userDto);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findById(req, res) {
        try {
            const {id} = req.params;
            if (!isValidObjectId(id)) {
                const error = new BadParameterException('id', id);

                return exceptionResponse(res, error);
            }

            const {user, exception} = await userService.findById();
            if (exception)
                return exceptionResponse(res, exception);

            return okResponse(res, user);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findAll(req, res) {
        try {
            const {isAdmin, notAuthorizedException} = await userService.checkIfUserIsAdmin(req.user);
            if (notAuthorizedException)
                return exceptionResponse(res, notAuthorizedException);

            const {users} = await userService.findAll();

            return okResponse(res, users);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;
            const {userDto, notAuthorizedException, error} = await userService.update(req.user._id, id, req.body);

            if (notAuthorizedException || error) {
                if (error)
                    return validationExceptionResponse(res, error);

                return exceptionResponse(res, notAuthorizedException);
            }

            return okResponse(res, userDto);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async deactivateUser(req, res) {
        try {
            const {id} = req.params;

            const {
                deactivatedUserDto,
                notAuthorizedException,
                notFoundException
            } = await userService.deactivateUser(id, req.user, req.body);
            if (notFoundException || notAuthorizedException) {
                if (notFoundException)
                    return exceptionResponse(res, notFoundException);

                return exceptionResponse(res, notAuthorizedException);
            }

            return okResponse(res, deactivatedUserDto);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async changePassword(req, res) {
        try {
            const changePasswordRequest = req.body;
            const userId = req.user._id;

            const {passwordNotMatchError, userUpdated} = await userService.changePassword(changePasswordRequest, userId);
            if (passwordNotMatchError)
                return exceptionResponse(res, passwordNotMatchError);

            return okResponse(res, userUpdated);
        } catch (err) {
            console.log(err);
            return internalExceptionResponse(res);
        }
    }
};
