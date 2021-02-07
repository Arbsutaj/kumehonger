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
    likes: {
        type: Number,
        default: 0
    },
    opensAt: {
        type: String,
        required: true
    },
    closesAt: {
        type: String,
        required: true
    },
    menus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: false,
    }],
    logo: {
        type: Buffer,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        }
    },
});
restaurantSchema.plugin(mongoosePaginate);
export default mongoose.model('Restaurant', restaurantSchema);
