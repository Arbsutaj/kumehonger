import userService from "../user/user.service";
import authenticationService from "./authentication.service";
import {
    exceptionResponse,
    internalExceptionResponse,
    okResponse,
    validationExceptionResponse
} from "../../helpers/utils";

export default {
    async login(req, res) {
        try {
            const {user, correctCredentialsError, validationError} = await userService.validateLoginRequest(req.body);
            if (validationError || correctCredentialsError) {
                if (validationError)
                    return validationExceptionResponse(res, validationError);

                return exceptionResponse(res, correctCredentialsError);
            }

            const {tokenPayload} = authenticationService.generateToken(user._id);

            return okResponse(res, tokenPayload);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async getLoggedInUser(req, res) {
        const {userDto} = await userService.toDto(req.user);

        return okResponse(res, userDto);
    }
}
