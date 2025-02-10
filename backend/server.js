import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import fs from 'fs';
import { getAllUsers, createUser, createActivity, updateActivity, getActivities, getSingleActivity, deleteActivity, getActivitiesFromUser, getUsersWithActivities, getSingleUser, getSingleUserEmail, setFinishState } from './database.js';
import passport from './passportConfig.js';
import session from 'express-session';
import ExcelJS from 'exceljs'; 
import dotenv from 'dotenv';
dotenv.config();
// console.log("session secret: ", process.env.SESSION_SECRET);


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

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

//-------------------------------------------------------------- 
// Login-Route -------------------------------------------------
//--------------------------------------------------------------
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

//--------------------------------------------------------------
// SAML-Callback-Route  FUNKTIONIERT ---------------------------
//--------------------------------------------------------------
app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), async (req, res) => {
    // console.log("in app.post login callback");
    
    let profile = req.user;

    if(!profile) {
        return res.status(400).send("Login failed: no profile provided");
    }
    
    // let email = "benser@campus.tu-berlin.de";
    let email = profile.email;

    let user = await getSingleUserEmail(email);

    if(user) {
        // console.log("user with email found: ", user);
        req.session.user = user; // neu hinzugefügt, mal sehen, ob es funktioniert
        res.redirect('/');
        // res.status(200).send("user with email found");
    } else {
        res.status(404).send("no user found");
    }
  }
);

app.get('/logout', (req, res) => {
    console.log("in backend logout function");
    
    req.logout((err) => { // Löscht die Passport-Session
        if (err) {
            console.error("Logout-Fehler:", err);
            return res.status(500).send("Logout-Fehler");
        }
        
        req.session.destroy((err) => { // Zerstört die Express-Session
            if (err) {
                console.error("Session konnte nicht gelöscht werden:", err);
                return res.status(500).send("Fehler beim Löschen der Session");
            }
            
            res.clearCookie('connect.sid'); // Session-Cookie löschen (wichtig!)
            console.log("req.session destroyed: ", req.session);
            
            // Weiterleitung zum IDP-Logout
            res.redirect('https://shibboleth-test.tu-berlin.de/idp/profile/Logout');
        });
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
    
    validators[schemaName] = (data) => {
        // Prüfe, ob alle `required`-Felder existieren und nicht leer sind
        if (schema.required) {
            for (const field of schema.required) {
                if (!data.hasOwnProperty(field) || data[field] === "" || data[field] === null || data[field] === undefined) {
                    return {
                        valid: false,
                        errors: [`Fehlendes oder leeres Feld: ${field}`]
                    };
                }
            }
        }

        // Falls die `required`-Felder passen, führe die normale Ajv-Validierung aus
        const validate = ajv.compile(schema);
        const isValid = validate(data);

        return {
            valid: isValid,
            errors: isValid ? [] : validate.errors.map(err => `${err.instancePath} ${err.message}`)
        };
    };
    
    // validators[schemaName] = ajv.compile(schema); 
});

//-----------------------------------------------------
// get user session -----------------------------------
//-----------------------------------------------------

app.get('/current-user', (req, res) => {
    // console.log("req.session.user in server.js: ", req.session.user);
    
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).send("No user session found");
    }
});

//-----------------------------------------------------
// User CRUD Operations -------------------------------
//-----------------------------------------------------

/** 
 * FUNKTIONIERT 
 * */
app.get('/api/all-users', async (req, res) => {
    const users = await getAllUsers();
    //console.log("users in server.js: ", users);
    return res.status(200).json({ users })
});

/**
 * FUNKTINOIERT
 */
app.post('/api/new-user', async (req, res) => {
    try {
        const { name, email, department, role } = req.body;
        const new_user = await createUser(name, email, department, role);
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
app.get('/api/user-all-activities/:userID', async (req, res) => {
    const userID = req.params.userID;
    //console.log("userID in backend: ", userID);
    const activities = await getActivitiesFromUser(userID);
    //console.log("activities from database in backend: ", activities);
    
    res.status(200).json(activities)
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
app.post('/api/new-activity/:type/:userID', async (req, res) => {   
    // Validierung der Eingabedaten
    // console.log("in backend with req.body and params: ", req.body, req.params);
    const type = req.params.type;
    const userID = req.params.userID;
    // console.log("user id in server.js: ", userID);
    // console.log("type: ", type);

    if (type == "aemter-und-gremienaktivitaet-an-der-tu-berlin") {
        // console.log("in type == ämter und aktivitäten");
        
        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            // console.log("req ist not valid in backend");
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // console.log("req.body is valid");
            
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Aemter und Gremienaktivität", req.body, userID);
            console.log("new activity created: ", newActivity);
            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    } else if (type == "ausstellungen-und-messen") {
        
        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {            
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Ausstellungen und Messen", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    } else if (type == "begutachtungs-und-beratungsfunktionen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Begutachtungs und Beratungsfunktionen", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    } else if (type == "einrichtung-eines-internationalen-studiengangs") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Einrichtung eines internationalen Studiengangs", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "elektronische-veroeffentlichungen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, aktivität weiterverarbeiten
            const newActivity = await createActivity("Elektronische Veröffentlichungen", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "lehre-pruefungsleistungen-bachelor-master") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Lehre - Prüfungsleistungen Bachelor", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "organisation-ausrichtung-von-tagungen-konferenzen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Organisation/Ausrichtung von Tagungen/Konferenzen", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "publikationen-in-sammelbaenden") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Publikationen in Sammelbänden", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "publikationen-in-wissenschaftlichen-fachzeitschriften") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Publikationen in wissenschaftlichen Fachzeitschriften", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "tu-interne-promotionen-fakultaetszentrale-erfassung") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("TU-interne Promotionen (fakultätszentrale Erfassung)", req.body, userID);
            console.log("new activity created: ", newActivity);

            res.status(200).json(newActivity);
        } catch (error) {
            console.error("Error creating activity:", error);
            res.status(500).json({ error: 'Error creating activity' });
        }
    }  else if (type == "vortrag-auf-tagungen-konferenzen") {

        const validate = validators[type]
        const isValid = validate(req.body);

        if (!isValid) {
            return res.status(400).json({ errors: isValid.errors });
        }

        try {
            // Wenn die Validierung erfolgreich war, Thesis weiterverarbeiten oder in die DB speichern
            const newActivity = await createActivity("Vortrag auf Tagungen/Konferenzen", req.body, userID);
            console.log("new activity created: ", newActivity);

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
* FUNKTIONIERT
*/ 
app.post('/api/send-data/:userID', async (req, res) => {   
    const userID = req.params.userID;
    console.log("userID in backend: ", userID);
    
    try {
        const result = await setFinishState(userID);

        res.status(201).json(result);
        
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
// Excel Tabelle erstellen                                 --
//-----------------------------------------------------------
app.get('/api/export-excel', async (req, res) => {
    try {
        const activities = await getActivities(); // Holt alle Einträge

        if (!activities || activities.length === 0) {
            return res.status(404).send("Keine Aktivitäten gefunden.");
        }

        // Erstelle eine neue Excel-Arbeitsmappe
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Aktivitäten");

        // Spalten definieren
        worksheet.columns = [
            { header: "ID", key: "_id", width: 25 },
            { header: "Aktivität", key: "activity", width: 30 },
            { header: "Erstellt am", key: "createdAt", width: 20 },
            { header: "User ID", key: "userID", width: 25 },
            { header: "Status", key: "finished", width: 10 },
            { header: "Eigenschaften", key: "properties", width: 50 }
        ];

        // Zeilen hinzufügen
        activities.forEach(activity => {
            worksheet.addRow({
                _id: activity._id,
                activity: activity.activity,
                createdAt: activity.createdAt,
                userID: activity.userID,
                finished: activity.finished ? "Abgeschlossen" : "Offen",
                properties: JSON.stringify(activity.properties, null, 2)
            });
        });

        // Datei im Speicher erstellen
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=aktivitäten.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);

    } catch (error) {
        console.error("Fehler beim Exportieren:", error);
        res.status(500).send("Fehler beim Erstellen der Excel-Datei.");
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});