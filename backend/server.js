import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import fs from 'fs';
import { getAllUsers, createUser, createActivity, updateActivity, getActivities, getSingleActivity, deleteActivity, getActivitiesFromUser, getUsersWithActivities } from './database.js';

const thesisSchemaPath = './schemas/thesis.json'; 
const courseSchemaPath = './schemas/course.json';
const publicationSchemaPath = './schemas/publication.json';
const fundingSchemaPath = './schemas/funding.json';

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

const publicationSchema = JSON.parse(fs.readFileSync(publicationSchemaPath, 'utf8'));
const validatePublication = ajv.compile(publicationSchema);

const fundingPath = JSON.parse(fs.readFileSync(fundingSchemaPath, 'utf8'));
const validateFunding = ajv.compile(fundingPath);


//-----------------------------------------------------
// User CRUD Operations -------------------------------
//-----------------------------------------------------

/* FUNKTIONIERT */
app.get('/api/all-users', async (req, res) => {
    const users = await getAllUsers();
    //console.log("users in server.js: ", users);
    return res.status(200).json({ users })
});

// app.get('/api/:id', async (req, res) => {

// });

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

//-----------------------------------------------------
// Activity CRUD Operations ---------------------------
//-----------------------------------------------------

/* FUNKTIONIERT */
app.get('/api/all-activities', async (req, res) => {
    const activities = await getActivities();
    // console.log("activities in backend: ", activities);

    res.status(200).json(activities);
})

/* FUNKTIONIERT */
app.get('/api/activity/:id', async (req, res) => {
    // let id = "674998eb9a611260366ec86d";
    // console.log("id: ",req.params.id, typeof(req.params.id));
    const activity = await getSingleActivity(req.params.id);

    res.status(200).json(activity);
})

/**
* FUNKTIONIERT
* @TODO : finished state mit einbauen -> default: false
*/
app.post('/api/new-activity/:type', async (req, res) => {   
    // Validierung der Eingabedaten
    // console.log("in backend with req.body and params: ", req.body, req.params);
    const type = req.params.type;
    // console.log("type: ", type);

    if (type == "thesis") {
        // console.log("type: thesis");
        
        const isValid = validateThesis(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateThesis.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newThesis = await createActivity("Abschlussarbeit", req.body);

            res.status(200).json(newThesis);
        } catch (error) {
            console.error("Error creating thesis:", error);
            res.status(500).json({ error: 'Error creating thesis' });
        }
    } else if (type == "course") {
        // console.log("type: course");

        const isValid = validateCourse(req.body);

        if (!isValid) {
            console.log("course not valid");
            return res.status(400).json({ errors: validateCourse.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newCourse = await createActivity("Kurs", req.body);

            res.status(200).json(newCourse);
        } catch (error) {
            console.error("Error creating course:", error);
            res.status(500).json({ error: 'Error creating course' });
        }
    } else if (type == "publication") {
        // console.log("type: publication");

        const isValid = validatePublication(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validatePublication.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newPublication = await createActivity("Publikation", req.body);

            res.status(200).json(newPublication);
        } catch (error) {
            console.error("Error creating publication:", error);
            res.status(500).json({ error: 'Error creating publication' });
        }
    } else if (type == "funding") {
        // console.log("type: funding");

        const isValid = validateFunding(req.body);

        if (!isValid) {
            console.log("funding not valid");
            return res.status(400).json({ errors: validateFunding.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newFunding = await createActivity("Spende", req.body);

            res.status(200).json(newFunding);
        } catch (error) {
            console.error("Error creating funding:", error);
            res.status(500).json({ error: 'Error creating funding' });
        }
    } else {
        res.status(404).json("No activity found")
    }
});

/** 
* @TODO : finished state change
*/ 
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

/* FUNKTIONIERT */
app.put('/api/update-activity', async (req, res) => {
    // console.log("in update activity backend");
    const { activityID, properties } = req.body;    

    const updated_activity = await updateActivity(activityID, properties);
    res.status(200).json(updated_activity);
})

/* FUNKTIONIERT */
app.delete('/api/delete-activity/:id', async (req, res) => {
    const deleteMessage = await deleteActivity(req.params.id);

    res.status(200).json(deleteMessage);
})

/** 
* FUNKTIONIERT 
* @TODO : nur aktivitäten fetchen, bei denen finished: true
*/ 
app.get('/api/users-with-activities', async (req, res) => {
    try {
        const usersWithActivities = await getUsersWithActivities();
        res.status(200).json(usersWithActivities);
    } catch (error) {
        console.error("Error fetching users with activities:", error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});


//-----------------------------------------------------------
// OLD ------------------------------------------------------
//-----------------------------------------------------------

/* alte users with activities funktion idee*/
app.get('/api/activities/:userID', async (req, res) => {
    // console.log("user id in backend: ", req.params.userID);
    const activities = await getActivitiesFromUser(req.params.userID);
    res.status(200).json(activities)
})


app.post('/api/new-course', async (req, res) => {  
    console.log("in backend with req.body: ", req.body);
     
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
            userID: 1,      // später über eingeloggten User
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