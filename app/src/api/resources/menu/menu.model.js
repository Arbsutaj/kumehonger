import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const menuSchema = new Schema({
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Menu must be part of an restaurant'],
    },
    description: {
        type: String,
    },
    servingTime: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String
    },
});
menuSchema.plugin(mongoosePaginate);
export default mongoose.model('Menu', menuSchema);
