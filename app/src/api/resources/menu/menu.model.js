import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const menuSchema = new Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Menu must be part of an restaurant'],
    },
    title: {
        type: String
    },
    description: {
        type: String,
    },
    servingTime: {
        hour: {
            type: Number,
            default: 0
        },
        minutes: {
          type: Number,
          default: 0
        }
    },
    image: {
        data: Buffer,
        contentType: String
    },
    category: {
        type: String,
        enum: ['general', 'salad', 'starter', 'speciality'],
        default: 'general'
    },
    ingredients: [{
        type: String
    }],
    price: {
        type: Number
    },
    isMenuOfTheWeek: {
        type: Boolean,
        default: false
    }
});
menuSchema.plugin(mongoosePaginate);
export default mongoose.model('Menu', menuSchema);
