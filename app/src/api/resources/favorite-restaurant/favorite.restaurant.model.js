import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const favoriteRestaurantSchema = new Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Favorite must have a restaurant!']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Favorite must be of a user!']
    },
});
favoriteRestaurantSchema.plugin(mongoosePaginate);
export default mongoose.model('FavoriteRestaurant', favoriteRestaurantSchema);
