import mongoose from 'mongoose';
import Activity from './Activity,js'

const publicationSchema = Activity.discriminator('Publication', new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
}));


export default mongoose.model('Publication', publicationSchema);