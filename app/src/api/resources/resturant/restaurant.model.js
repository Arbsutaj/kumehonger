import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Restaurant must have name'],
    },
    description: {
        type: String,
        required: [true, 'Restaurant must have description'],
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    menus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: false,
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
restaurantSchema.plugin(mongoosePaginate);
export default mongoose.model('Restaurant', restaurantSchema);
