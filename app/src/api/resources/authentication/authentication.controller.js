import userService from "../user/user.service";
import authenticationService from "./authentication.service";

export default {
    async login(req, res) {
        try {
            const {user, correctCredentialsError, validationError} = await userService.validateLoginRequest(req.body);
            if (validationError)
                return res.status(401).json({status: '400', error: validationError});
            if (correctCredentialsError)
                return res.status(401).json({status: '401', error: correctCredentialsError});

            const {tokenPayload} = await authenticationService.generateToken(user._id);

            return res.status(200).json(tokenPayload);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async getLoggedInUser(req, res) {
        const {userDto} = await userService.toDto(req.user);

        return res.json(userDto);
    },
}
