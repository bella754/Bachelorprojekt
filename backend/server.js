import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Thesis from './models/Thesis.js';
import Activity from './models/Activity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.listen(3000, () => {
    console.log("Listen on http://localhost:3000");
});

app.post('/api/thesis', async (req, res) => {
    // console.log("in backendn get request");
    const { degree, title, author, supervisor, supervisor2, language } = req.body;
    try {
        // const newThesis = new Activity({
        //     type: 'Thesis',
        //     degree: degree,
        //     title: title,
        //     author: author,
        //     first_supervisor: supervisor,
        //     second_supervisor: supervisor2,
        //     language: language
        // });
        // const savedThesis = await newThesis.save();
        // console.log("newThesis in backend: ", newThesis);
        // console.log("savedThesis in backend: ", savedThesis);
        
        const newThesis = {
            type: 'Thesis',
            degree: degree,
            title: title,
            author: author,
            first_supervisor: supervisor,
            second_supervisor: supervisor2,
            language: language
        }

        console.log("newThesis: ", newThesis);
    
        res.status(200).json(newThesis);
    } catch(error) {
        console.error("Error creating thesis:", error);
        res.status(500).json({ error: 'Error creating thesis' });
    }
    
});
