import mongoose from 'mongoose';

const { Schema } = mongoose;
const userProfileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    profilePhoto: {
        type: Buffer,
        required: true
    },
    website: {
        type: String
    },
    github: {
        type: String
    },
    twitter: {
        type: String
    },
    instagram: {
        type: String
    },
    facebook: {
        type: String
    },
    phone: {
        type: String
    },
    mobile: {
        type: String
    },
    state: {
        type: String
    },
    city: {
        type: String
    },
    street: {
        type: String
    },
    address: {
        type: String
    },
    country: {
        type: String
    }
});

export default mongoose.model('UserProfile', userProfileSchema);
