import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import fs from 'fs';
import { formatDateTime } from './helper.js';
import { getAllUsers, createUser } from './database.js';

const thesisSchemaPath = './schemas/thesis.json'; 
const courseSchemaPath = './schemas/course.json';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();


app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist')));

app.listen(3000, () => {
    console.log("Listen on http://localhost:3000");
});

// Ajv-Instanz erstellen -> zum Schema validieren
const ajv = new Ajv();
ajv.addKeyword("inputType");
ajv.addKeyword("name");

// JSON-Schemata laden und kompilieren
const thesisSchema = JSON.parse(fs.readFileSync(thesisSchemaPath, 'utf8'));
const validateThesis = ajv.compile(thesisSchema);

const courseSchema = JSON.parse(fs.readFileSync(courseSchemaPath, 'utf8'));
const validateCourse = ajv.compile(courseSchema);


//------------------
// CRUD Operations -
//------------------

app.get('/api', async (req, res) => {
    const users = await getAllUsers();
    console.log("users in server.js: ", users);
    
    return res.status(200).json({ users })
});

app.get('/api/:id', async (req, res) => {

});

app.post('/api/new-user', async (req, res) => {
    try {
        const { name, email, department } = req.body;
        const new_user = await createUser(name, email, department);
        return res.status(201).json(new_user);
    } catch(error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Error creating user' });
    }
    
    
})

app.post('/api/thesis', async (req, res) => {   
    const { degree, title, author, first_supervisor, second_supervisor, language } = req.body; 
    // Validierung der Eingabedaten
    const isValid = validateThesis(req.body);

    if (!isValid) {
        return res.status(400).json({ errors: validateThesis.errors });
    }

    try {
        // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
        const newThesis = {
            activity: "Abschlussarbeit",
            createdAt: formatDateTime(new Date()),
            properties: {
                degree,
                title,
                author,
                first_supervisor,
                second_supervisor,
                language
            }
        };

        res.status(200).json(newThesis);
    } catch (error) {
        console.error("Error creating thesis:", error);
        res.status(500).json({ error: 'Error creating thesis' });
    }
});


app.post('/api/course', async (req, res) => {   
    const {name, numberOfStudents, lecturer, semester } = req.body; 
    // Validierung der Eingabedaten
    const isValid = validateCourse(req.body);

    if (!isValid) {
        return res.status(400).json({ errors: validateCourse.errors });
    }

    try {
        // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
        const newCourse = {
            activity: "Kurs",
            createdAt: formatDateTime(new Date()),
            properties: {
                name,
                numberOfStudents,
                lecturer,
                semester
            }
        };

        res.status(200).json(newCourse);
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: 'Error creating course' });
    }
});

app.post('/api/send-data', async (req, res) => {   
    const { inputData } = req.body; 
    // Validierung der Eingabedaten
    // const isValid = validateCourse(req.body);

    // if (!isValid) {
    //     return res.status(400).json({ errors: validateCourse.errors });
    // }

    try {
        // hier müssen die daten in die übergeordnete datenbank eingepflegt werden

        res.status(200).json(newCourse);
    } catch (error) {
        console.error("Error sending data:", error);
        res.status(500).json({ error: 'Error sending data' });
    }
});
