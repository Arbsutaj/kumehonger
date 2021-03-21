import RestaurantComment from "./restaurant.comment.model";
import Restaurant from "../restaurant.model";
import restaurantService from "../restaurant.service";
import {throwNotFoundException} from "../../../helpers/utils";
import {NotAuthorizedException} from "../../exception/not-authorized-exception";
import UserProfile from "../../user/profile/user.profile.model";
import userProfileService from "../../user/profile/user.profile.service";

async function findById(id) {
    const comment = await RestaurantComment.findById(id);
    if (comment)
        return {comment};

    return throwNotFoundException(id, entityType);
}

async function checkIfIsCommentCreator(userId, id) {
    const {comment, notFoundException} = await findById(id);
    if (notFoundException)
        return {notFoundException};

    if (!userId.equals(comment.user)) {
        const unAuthorizedException = new NotAuthorizedException('Unauthorized, user is not comment\'s creator!');
        return {unAuthorizedException};
    }

    return {commentInDb: comment};
}

async function toRestaurantCommentsPaginationDto(pagingEntity, comments) {
    return {
        restaurantComments: comments,
        page: pagingEntity.page,
        limit: pagingEntity.limit,
        total: pagingEntity.total,
        pages: pagingEntity.pages
    };
}

export const entityType = 'Comment';

export default {
    async addComment(comment) {
        const restaurantId = comment.restaurant;
        const {restaurant, notFoundException} = await restaurantService.findById(restaurantId);
        if (notFoundException)
            return {notFoundException};

        comment.createdAt = Date.now();
        const commentInDb = await RestaurantComment.create(comment);

        restaurant.numberOfComments = restaurant.numberOfComments + 1;
        await Restaurant.findOneAndUpdate({_id: restaurantId}, restaurant, {new: true});
        return {commentInDb};
    },
    async removeComment(id) {
        let {comment, notFoundException} = await findById(id);
        if (notFoundException)
            return {notFoundException};

        const {restaurant} = await restaurantService.findById(comment.restaurant);
        restaurant.numberOfComments = restaurant.numberOfComments - 1;
        await Restaurant.findOneAndUpdate({_id: restaurant._id}, restaurant, {new: true});

        await RestaurantComment.deleteOne({_id: id});
        return {success: {success: true}};
    },
    async findAllRestaurantsComments(id) {
        return await RestaurantComment.find({restaurant: id});
    },
    async update(id, userId, comment) {
        let {commentInDb, notFoundException, unAuthorizedException} = await checkIfIsCommentCreator(userId, id);

        if (notFoundException || unAuthorizedException)
            return {notFoundException, unAuthorizedException};

        commentInDb.description = comment.description;
        const commentUpdated = await RestaurantComment.findOneAndUpdate({_id: id}, commentInDb, {new: true});
        return {commentUpdated};
    },
    async findCommentsByRestaurantIdPaginated(restaurantId, options) {
        const restaurantCommentsDto = [];
        let comments = await RestaurantComment.paginate({restaurant: restaurantId}, options);
        for (let i = 0; i < comments.docs.length; i++) {
            restaurantCommentsDto.push(comments.docs[i]);
        }

        let userIdsFromComments = restaurantCommentsDto.map(comment => comment.user);
        const userIds = [...new Set(userIdsFromComments)];

        const users = await UserProfile.find({user: { "$in" : userIds}});
        let userMap = new Map();
        users.forEach(user => { userMap.set(user.user.toString(), userProfileService.toDto(user._doc));});
        const restaurantCommentsWithUserProfile = restaurantCommentsDto.map(r => {
            return {
                id: r._id,
                restaurant: r.restaurant,
                user: userMap.get(r.user),
                description: r.description,
                createdAt: r.createdAt,
                userId: r.user
            };
        });

        return {restaurantComments: await toRestaurantCommentsPaginationDto(comments, restaurantCommentsWithUserProfile)};
    }
}
