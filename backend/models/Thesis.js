import mongoose from 'mongoose';
import Activity from './Activity.js'

const thesisSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    first_supervisor: {
        type: String,
        required: true,
    },
    second_supervisor: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    }
});

const Thesis = Activity.discriminator('Thesis', thesisSchema)
export default Thesis;