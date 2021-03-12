import Joi from 'joi';
import bcrypt from 'bcryptjs';
import User from "./user.model";
import {Role} from "../../middlewares/role";
import {NotFoundException} from "../exception/not-found-exception";
import {NotAuthorizedException} from "../exception/not-authorized-exception";
import {BadParameterException} from "../exception/bad-parameter-exception";

async function validateUserAuthentication(email, password) {
    const user = await User.findOne({email: email});
    const correctCredentialsError = new NotAuthorizedException('Email or password incorrect!');
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

async function findById(id) {
    const userInDb = await User.findById(id);
    if (userInDb)
        return {userInDb};

    const notFoundException = new NotFoundException(id, entityType);
    return {notFoundException};
}

async function toUpdateEntity(userDto) {
    return {
        firstName: userDto.name,
        lastName: userDto.lastName,
        email: userDto.email
    }
}

async function toDto(user) {
    const userDto = {
        id: user._id,
        name: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        active: user.active
    };

    return {userDto};
}

async function validateUpdateEntity(user) {
    const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string()
            .email()
            .required(),
        role: Joi.number().integer().optional(),
    });

    const {value, error} = Joi.validate(user, schema);
    if (error && error.details)
        return {error};

    return {value};
}

export const entityType = 'User';
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
            role: request.role || Role.USER,
            active: request.active || true
        };

        return {user};
    },
    async toDto(entity) {
        const {userDto} = await toDto(entity);

        return {userDto};
    },
    async isEmailAlreadyBeingUsed(email) {
        const {user} = await findByEmail(email);

        if (user) {
            const exception = new BadParameterException('email', 'User with this email already exists!');
            return {emailIsAlreadyUsed: true, exception};
        }

        return {emailIsAlreadyUsed: false};
    },
    async findById(id) {
        const {userInDb, notFoundException} = await findById(id);

        if (notFoundException)
            return {exception: notFoundException};

        return {user: userInDb};
    },
    async findAll() {
        const users = await User.find({active: true});

        return {users};
    },
    async update(userId, id, userRequest) {
        if (!userId.equals(id)) {
            const notAuthorizedException = new NotAuthorizedException('You cannot update another user!');
            return {notAuthorizedException};
        }

        const userToUpdate = await toUpdateEntity(userRequest);
        const {value, error} = await validateUpdateEntity(userToUpdate);
        if (error)
            return {error};
        const userUpdated = await User.findOneAndUpdate({_id: id}, userToUpdate, {new: true});
        const {userDto} = await toDto(userUpdated);

        return {userDto};
    },
    async checkIfUserIsAdmin(user) {
        if (user.role !== Role.ADMIN) {
            const notAuthorizedException = new NotAuthorizedException('User is not an admin!');
            return {notAuthorizedException};
        }

        return {isAdmin: true};
    },
    async deactivateUser(id, user, deactivateRequest) {
        if (!user._id.equals(id)) {
            const notAuthorizedException = new NotAuthorizedException('You cannot deactivate another user!');

            return {notAuthorizedException};
        }

        const deactivatedUser = await User.findOneAndUpdate({_id: id}, {active: false}, {new: true});
        if (!deactivatedUser) {
            const notFoundException = new NotFoundException(id, entityType);

            return {notFoundException};
        }

        const userDto = await toDto(user);
        return {deactivatedUserDto: userDto};
    }
};
