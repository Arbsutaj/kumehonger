import UserProfile from "./user.profile.model";
import userService from "../user.service";
import {throwNotAuthorizedException, throwNotFoundException, toBase64, toBinaryData} from "../../../helpers/utils";

function toDto(userProfileEntity) {
    return {
        id: userProfileEntity._id,
        website: userProfileEntity.website,
        user: userService.toDto(userProfileEntity.user),
        github: userProfileEntity.github,
        twitter: userProfileEntity.twitter,
        instagram: userProfileEntity.instagram,
        facebook: userProfileEntity.facebook,
        phone: userProfileEntity.phone,
        mobile: userProfileEntity.mobile,
        state: userProfileEntity.state,
        city: userProfileEntity.city,
        street: userProfileEntity.street,
        address: userProfileEntity.address,
        country: userProfileEntity.country,
        profilePhoto: toBase64(userProfileEntity.profilePhoto)
    }
}

async function toUpdateEntity(userProfileEntity) {
    return {
        website: userProfileEntity.website,
        github: userProfileEntity.github,
        twitter: userProfileEntity.twitter,
        instagram: userProfileEntity.instagram,
        facebook: userProfileEntity.facebook,
        phone: userProfileEntity.phone,
        mobile: userProfileEntity.mobile,
        state: userProfileEntity.state,
        city: userProfileEntity.city,
        street: userProfileEntity.street,
        address: userProfileEntity.address,
        country: userProfileEntity.country,
        profilePhoto: toBinaryData(userProfileEntity.profilePhoto)
    }
}

export default {
    async create(userProfile, userId) {
        const userProfileExisting = await UserProfile.findOne({user: userId});
        if (userProfileExisting)
            return {error: {statusCode: 400, message: 'Already existing'}};

        const userProfileWithAssignedValues = Object.assign({}, userProfile, {
            user: userId,
            profilePhoto: toBinaryData(userProfile.profilePhoto)
        });
        const userProfileInDb = await UserProfile.create(userProfileWithAssignedValues);

        return {userProfileInDb};
    },
    async findById(userId) {
        let userProfile = await UserProfile.findOne({user: userId}).populate('user');
        if (!userProfile)
            return throwNotFoundException(userId, 'UserProfile');
        const userProfileDto = await toDto(userProfile);

        return {userProfileDto};
    },
    async update(userProfile, userId, id) {
        const userProfileInDb = await UserProfile.findById(id).populate('user');
        if (!userId.equals(userProfileInDb.user._id))
            return throwNotAuthorizedException('You cannot modify another user profile');

        if (!userProfileInDb)
            return throwNotFoundException(id, 'User Profile');

        const {userDto, notAuthorizedException, error} = await userService.update(userId, userId, userProfile.user.userDto);
        if (notAuthorizedException || error) {
            if (notAuthorizedException)
                return {notAuthorizedException};

            return {error};
        }
        const userProfileUpdateEntity = await toUpdateEntity(userProfile);
        const userProfileUpdated = await UserProfile.findOneAndUpdate({_id: id}, userProfileUpdateEntity, {new: true}).populate('user');
        const userProfileDto = await toDto(userProfileUpdated);

        return {userProfileDto};
    },
    toDto(entity) {
        return toDto(entity);
    }
}
