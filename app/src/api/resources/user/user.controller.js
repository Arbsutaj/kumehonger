import userService from './user.service';
import User from './user.model';

export default {
    async signUp(req, res) {
        try {
            const {value, error} = await userService.validateSignUpRequest(req.body);
            if (error)
                return res.status(400).json(error);

            const { emailIsAlreadyUsed, exception } = await userService.isEmailAlreadyBeingUsed(value.email);
            if (emailIsAlreadyUsed)
                return res.status(exception.statusCode).json(exception.getJsonExceptionMessage());

            const {user} = await userService.toEntity(value);
            const userCreated = await User.create(user);
            const {userDto} = await userService.toDto(userCreated);

            return res.json(userDto);
        } catch (err) {
            return res.status(500).send(err);
        }
    },
};
