import mongoose from 'mongoose';
import Activity from "./Activity.js"

const courseSchema = Activity.discriminator('Course', new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number_of_students: {
        type: Number,
        required: true,
    },
    lecturer: {
        type: String,
        required: true,
    },
    semester: String
}));


export default mongoose.model('Course', courseSchema);