import userProfileService from "./user.profile.service";
import {exceptionResponse, internalExceptionResponse, okResponse} from "../../../helpers/utils";

export default {
    async create(req, res) {
        try {
            const userProfile = req.body;
            const userId = req.user._id;

            const {userProfileInDb, error} = await userProfileService.create(userProfile, userId);
            if (error)
                return exceptionResponse(res, error);

            return okResponse(res, userProfileInDb);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findByUserId(req, res) {
        try {
            const {id} = req.params;

            const {userProfileDto, notFoundException} = await userProfileService.findById(id);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, userProfileDto);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async findLoggedInUserProfile(req, res) {
        try {
            const id = req.user._id;

            const {userProfileDto, notFoundException} = await userProfileService.findById(id);
            if (notFoundException)
                return exceptionResponse(res, notFoundException);

            return okResponse(res, userProfileDto);
        } catch (err) {
            return internalExceptionResponse(res);
        }
    },
    async update(req, res) {
        try {
            const {id} = req.params;
            const userId = req.user._id;
            const userProfile = req.body;

            const {userProfileDto, notFoundException, notAuthorizedException, error} = await userProfileService.update(userProfile, userId, id);
            if (notFoundException || notAuthorizedException || error) {
                if (notFoundException)
                    return exceptionResponse(res, notFoundException);
                if (error)
                    return exceptionResponse(res, error);

                return exceptionResponse(res, notAuthorizedException);
            }

            return okResponse(res, userProfileDto);
        } catch (err) {
            console.log(err);
            return internalExceptionResponse(res);
        }
    }
}
