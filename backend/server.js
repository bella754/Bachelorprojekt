import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import fs from 'fs';
import { getAllUsers, createUser, createActivity, updateActivity, getActivities, getSingleActivity, deleteActivity, getActivitiesFromUser, getUsersWithActivities } from './database.js';
import passport from './passportConfig.js';
import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../dist')));

//----------------------------------------------------
// Passport ------------------------------------------
//----------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Login-Route
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

// SAML-Callback-Route
app.post(
  '/login/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  (req, res) => {
    res.redirect('/dashboard'); // Weiterleitung nach erfolgreichem Login
  }
);

// Logout-Route
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

//----------------------------------------------------
// Schema Validation ---------------------------------
//----------------------------------------------------
const ajv = new Ajv(); // Ajv-Instanz erstellen -> zum Schema validieren

const schemaDir = './schemas/new/';
const schemaFiles = fs.readdirSync(schemaDir);
const validators = {};

schemaFiles.forEach((file) => {
    const schemaName = file.replace('.json', '');
    const schemaPath = path.join(schemaDir, file); 
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8')); 
    validators[schemaName] = ajv.compile(schema); 
});
// console.log("validators: ", validators);


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
* @TODO : ausstellungen und orga mit bool werten müssen noch geändert 
*         dann zum laufen gebracht werdens
*/
app.post('/api/new-activity/:type', async (req, res) => {   
    // Validierung der Eingabedaten
    // console.log("in backend with req.body and params: ", req.body, req.params);
    const type = req.params.type;
    // console.log("type: ", type);

    if (type == "aemter-und-gremienaktivitaet-an-der-tu-berlin") {
        
        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateAemter.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Aemter ud Gremienaktivität", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    } else if (type == "ausstellungen-und-messen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateAusstellung.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Ausstellungen und Messen", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    } else if (type == "begutachtungs-und-beratungsfunktionen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateBegutachtung.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Begutachtungs und Beratungsfunktionen", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    } else if (type == "einrichtung-eines-internationalen-studiengangs") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateIntStudiengang.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Einrichtung eines internationalen Studiengangs", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "elektronische-veroeffentlichungen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateElektVeroeffent.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, aktivität weiterverarbeiten
            const newActivity = await createActivity("Elektronische Veröffentlichungen", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "lehre-pruefungsleistungen-bachelor-master") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateAbschlussarbeit.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Lehre - Prüfungsleistungen Bachelor", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "organisation-ausrichtung-von-tagungen-konferenzen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateOrgaTagung.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Organisation/Ausrichtung von Tagungen/Konferenzen", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "publikationen-in-sammelbaenden") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validatePublikationSammel.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Publikationen in Sammelbänden", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "publikationen-in-wissenschaftlichen-fachzeitschriften") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validatePublikationZeitschr.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Publikationen in wissenschaftlichen Fachzeitschriften", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "tu-interne-promotionen-fakultaetszentrale-erfassung") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateInternePromotion.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("TU-interne Promotionen (fakultätszentrale Erfassung)", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "vortrag-auf-tagungen-konferenzen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: validateVortrag.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Vortrag auf Tagungen/Konferenzen", req.body);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
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

/* 
* FUNKTIONIERT 
* Beispielaufruf in Postman: PUT http://localhost:3000/api/update-activity 
* mit body { "activityID": "677eab863a2c3c5edbd6bb4b", "properties": {"Vorname": "neuer eintrag"}}
*/
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
// Moses TEST        WORKED - YAYY                         --
//-----------------------------------------------------------
app.get('/api/moses', async (req, res) => {
    fetch("https://moseskonto.tu-berlin.de/moses/api/v1/ping", { // '/ping' hinzugefügt
        method: "GET",
        headers: {
            "x-api-key": process.env.MOSES_TOKEN
        }
    })
    .then(response => { 
        if (response.ok) {
            return response.text(); // Da die API laut Doku nur "pong" als Text zurückgibt
        } else {
            res.status(response.status).send(`Server returned ${response.status}: ${response.statusText}`);
        }                
    })
    .then(result => {
        res.status(200).send(result); // Sende das Ergebnis zurück
    })
    .catch(err => {
        console.error("Fetch error:", err);
        res.status(500).send("Error fetching data");
    });
});



// Server starten
app.listen(3000, () => {
    console.log("Listen on http://localhost:3000");
});