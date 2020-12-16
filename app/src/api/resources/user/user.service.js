import Joi from 'joi';
import bcrypt from 'bcryptjs';
import User from "./user.model";
import {Role} from "../../middlewares/role";
import {Exception} from "../exception/exception";

async function validateUserAuthentication(email, password) {
    const user = await User.findOne({email: email});
    const correctCredentialsError = 'Email or password incorrect!';
    if (!user)
        return {correctCredentialsError};

    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect)
        return {correctCredentialsError};

    return {user};
}

async function comparePassword(plainText, encryptedPassword) {
    return bcrypt.compareSync(plainText, encryptedPassword);
}

function getValidationForLoginRequest() {
    const schema = Joi.object().keys({
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string().required(),
    });

    return {schema};
}

function getValidationForUserEntity() {
    const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string().required(),
        role: Joi.number().integer(),
    });

    return {schema};
}

function encryptPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

async function findByEmail(email) {
    const user = await User.findOne({email: email});

    return {user};
}

export default {

    async validateSignUpRequest(signUpRequest) {
        const {schema} = getValidationForUserEntity();
        const {value, error} = Joi.validate(signUpRequest, schema);
        if (error && error.details) {
            return {error};
        }

        return {value};
    },
    async validateLoginRequest(loginRequest) {
        const {schema} = getValidationForLoginRequest();
        const {value, validationError} = Joi.validate(loginRequest, schema);
        if (validationError && validationError.details) {
            return {validationError};
        }

        const {user, correctCredentialsError} = await validateUserAuthentication(loginRequest.email, loginRequest.password);

        if (correctCredentialsError)
            return {correctCredentialsError};

        return {user};
    },
    async toEntity(request) {
        const user = {
            firstName: request.firstName,
            lastName: request.lastName,
            email: request.email,
            password: encryptPassword(request.password),
            role: request.role || Role.USER
        };

        return {user};
    },
    async toDto(entity) {
        const userDto = {
            name: entity.firstName,
            lastName: entity.lastName,
            email: entity.email,
            role: entity.role
        };

        return {userDto};
    },

    async isEmailAlreadyBeingUsed(email) {
        const {user} = await findByEmail(email);

        if (user){
            const exception = new Exception(400, 'User with this email already exists!');
            return {emailIsAlreadyUsed: true, exception};

        }

        return {emailIsAlreadyUsed: false};
    }
};
