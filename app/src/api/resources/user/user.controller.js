import userService from './user.service';
import User from './user.model';

export default {
    async signUp(req, res) {
        try {
            const {value, error} = await userService.validateSignUpRequest(req.body);
            if (error)
                return res.status(400).json(error);

            const { emailIsAlreadyUsed, exception } = await userService.isEmailAlreadyBeingUsed(value.email);
            console.log(emailIsAlreadyUsed);
            if (emailIsAlreadyUsed)
                return res.status(exception.statusCode).json(exception.getJsonExceptionMessage());

            const {user} = await userService.toEntity(value);
            const userCreated = User.create(user);
            const {userDto} = await userService.toDto(userCreated);

            return res.json(userDto);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async login(req, res) {
        try {
            const {user, correctCredentialsError, validationError} = await userService.authenticateUser(req.body);
            if (validationError)
                return res.status(401).json({status: '400', error: validationError});
            if (correctCredentialsError)
                return res.status(401).json({status: '401', error: correctCredentialsError});

            const {tokenPayload} = await userService.generateToken(user._id);

            return res.status(200).json(tokenPayload);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
    async authenticate(req, res) {
        const {userDto} = await userService.toDto(req.user);

        return res.json(userDto);
    },
};
