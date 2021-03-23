import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const contactUs = new Schema({
    name: {
        type: String,
        required: [true, 'Must provide a name!'],
    },
    email: {
        type: String,
        required: [true, 'Must have an email!']
    },
    subject: {
        type: String,
        required: [true, 'Must have a subject!']
    },
    message: {
        type: String,
        required: [true, 'Must have a subject!']
    }
});
contactUs.plugin(mongoosePaginate);
export default mongoose.model('ContactUs', contactUs);
