import mongoose from 'mongoose';
import Activity from './Activity,js'

const fundingSchema = Activity.discriminator('Funding', new mongoose.Schema({
    donor_name: {
        type: String,
        required: true,
    },
    ammount: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    }
}));


export default mongoose.model('Funding', fundingSchema);