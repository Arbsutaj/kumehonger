import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const userLikeRestaurantModel = new Schema({
    user: {
        type: String,
        required: [true, 'Like must be of one user!'],
    },
    restaurant: {
        type: String,
        required: [true, 'Like must be of one restaurant!']
    }
});
userLikeRestaurantModel.plugin(mongoosePaginate);
export default mongoose.model('UserLikeRestaurant', userLikeRestaurantModel);
