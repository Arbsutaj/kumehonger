import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const restaurantComment = new Schema({
    user: {
        type: String,
        required: [true, 'Comment must be of one user!'],
    },
    restaurant: {
        type: String,
        required: [true, 'Comment must be of one restaurant!']
    },
    createdAt: {type: Date, default: Date.now},
    description: String
});
restaurantComment.plugin(mongoosePaginate);
export default mongoose.model('RestaurantComment', restaurantComment);
