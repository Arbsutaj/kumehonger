import userService from "../user/user.service";
import authenticationService from "./authentication.service";
import {returnInternalExceptionResponse, returnOkResponse} from "../../helpers/utils";

export default {
    async login(req, res) {
        try {
            const {user, correctCredentialsError, validationError} = await userService.validateLoginRequest(req.body);
            if (validationError)
                return res.status(400).json({status: '400', error: validationError});
            if (correctCredentialsError)
                return res.status(401).json({status: '401', error: correctCredentialsError});

            const {tokenPayload} = authenticationService.generateToken(user._id);

            returnOkResponse(res, tokenPayload);
        } catch (err) {
            returnInternalExceptionResponse(res);
        }
    },
    async getLoggedInUser(req, res) {
        const {userDto} = await userService.toDto(req.user);

        returnOkResponse(res, userDto);
    }
}
