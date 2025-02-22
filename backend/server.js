import express from 'express';
import bodyParser from 'body-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import fs from 'fs';
import { getAllUsers, createUser, updateUser, createActivity, updateActivity, getActivities, getSingleActivity, deleteActivity, getActivitiesFromUser, getUsersWithActivities, getSingleUser, getSingleUserEmail, setFinishState, deleteUser } from './database.js';
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

//-----------------------------------------------
// Login-Route ----------------------------------
//-----------------------------------------------
app.get('/login', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }));

//------------------------------------------------
// SAML-Callback-Route ---------------------------
//------------------------------------------------
app.post('/login/callback', passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }), async (req, res) => {
    
    let profile = req.user;

    if(!profile) {
        return res.status(400).send("Login failed: no profile provided");
    }
    
    let email = profile.email;

    let user = await getSingleUserEmail(email);

    if(user) {
        req.session.user = user; 
        res.redirect('/');
    } else {
        res.status(404).send("no user found");
    }
  }
);

//-----------------------------------------------
// Logout-Route ---------------------------------
//-----------------------------------------------
app.get('/logout', (req, res) => {    
    req.logout((err) => { 
        if (err) {
            console.error("Logout-Fehler:", err);
            return res.status(500).send("Logout-Fehler");
        }
        
        req.session.destroy((err) => { 
            if (err) {
                console.error("Session konnte nicht gelöscht werden:", err);
                return res.status(500).send("Fehler beim Löschen der Session");
            }
            
            res.clearCookie('connect.sid');
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

const schemaDir = './schemas/';
const schemaFiles = fs.readdirSync(schemaDir);
const validators = {};

schemaFiles.forEach((file) => {
    const schemaPath = path.join(schemaDir, file);
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    if (!schema.title) {
        console.error(`Schema ${file} hat keinen Titel.`);
        return;
    }

    const schemaTitle = schema.title; // Verwende den Titel als Schlüssel für die Validierung

    validators[schemaTitle] = (data) => {
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
});



//-----------------------------------------------------
// get user session -----------------------------------
//-----------------------------------------------------

app.get('/api/current-user', (req, res) => {
    // console.log("req.session.user in server.js: ", req.session.user);
    
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(404).send("No user session found");
    }
});

//-----------------------------------------------------
// User CRUD Operations -------------------------------
//-----------------------------------------------------

/** 
 * FUNKTIONIERT 
 */
app.get('/api/all-users', async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json({ users });
    } catch (error) {
        console.error("Fehler beim Abrufen der Benutzer:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Benutzer nicht abrufen' });
    }
});

/** 
 * FUNKTIONIERT 
 */
app.get('/api/get-user/:userID', async (req, res) => {
    try {
        const user = await getSingleUser(req.params.userID);
        if (!user) {
            return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Fehler beim Abrufen des Benutzers:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Benutzer nicht abrufen' });
    }
});

/**
 * FUNKTINOIERT
 */
app.post('/api/new-user', async (req, res) => {
    try {
        const { name, email, department, role } = req.body;

        if (!name || !email || !department) {
            return res.status(400).json({ error: "Name, Email und Department sind erforderlich" });
        }

        const existingUser = await getSingleUserEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Ein Benutzer mit dieser E-Mail existiert bereits" });
        }

        const new_user = await createUser(name, email, department, role);
        return res.status(201).json(new_user);
    } catch(error) {
        console.error("Fehler beim Erstellen des Benutzers:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Benutzer nicht erstellen' });
    }
});

app.put('/api/update-user', async (req, res) => {
    try {
        const { userID, ...updateFields } = req.body; 

        if (!userID) {
            return res.status(400).json({ error: "UserID ist erforderlich" });
        }

        const existingUser = await getSingleUser(userID);
        if (!existingUser) {
            return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }

        const updatedUser = await updateUser(userID, updateFields);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Benutzers:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Benutzer nicht aktualisieren' });
    }
});

app.delete('/api/delete-user/:userID', async (req, res) => {
    try {
        const existingUser = await getSingleUser(req.params.userID);
        if (!existingUser) {
            return res.status(404).json({ error: "Benutzer nicht gefunden" });
        }

        const deleteMessage = await deleteUser(req.params.userID);
        res.status(200).json(deleteMessage);
    } catch (error) {
        console.error("Fehler beim Löschen des Benutzers:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Benutzer nicht löschen' });
    }
});

//-----------------------------------------------------
// Activity CRUD Operations ---------------------------
//-----------------------------------------------------

/* FUNKTIONIERT */
app.get('/api/all-activities', async (req, res) => {
    try {
        const activities = await getActivities();    
        res.status(200).json(activities);
    }  catch (error) {
        console.error("Fehler beim Abrufen der Aktivitäten:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Aktivitäten nicht abrufen' });
    }
})

/* FUNKTIONIERT */
app.get('/api/user-all-activities/:userID', async (req, res) => {
    try {
        const userID = req.params.userID;
        const activities = await getActivitiesFromUser(userID);
        res.status(200).json(activities)
    } catch (error) {
        console.error("Fehler beim Abrufen der Aktivitäten des Nutzers:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Aktivitäten des Nutzers nicht abrufen' });
    }
        
    
});

/* FUNKTIONIERT */
app.get('/api/activity/:id', async (req, res) => {
    try {
        const activity = await getSingleActivity(req.params.id);
        res.status(200).json(activity);
    } catch (error) {
        console.error("Fehler beim Abrufen der Aktivität:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Aktivität nicht abrufen' });
    }
});

/**
* FUNKTIONIERT
* @TODO : ausstellungen und orga mit bool werten müssen noch geändert 
*         dann zum laufen gebracht werdens
*/
app.post('/api/new-activity/:userID', async (req, res) => {   
    const userID = req.params.userID;
    const { activityTitle, ...activityData } = req.body;

    if (!activityTitle) {
        return res.status(400).json({ error: "Kein schemaTitle im Request-Body angegeben." });
    }

    const validate = validators[activityTitle];
    console.log("activityTitle: ", activityTitle);
    console.log("validators: ", validators);
    console.log("validators[activityTitle]: ", validate);
    
    
    
    if (!validate) {
        return res.status(400).json({ error: "Ungültiger schemaTitle oder Schema nicht gefunden." });
    }

    const isValid = validate(activityData);
    if (!isValid.valid) {
        return res.status(400).json({ errors: isValid.errors });
    }

    try {
        const newActivity = await createActivity(activityTitle, activityData, userID);
        console.log("New activity created:", newActivity);
        res.status(200).json(newActivity);
    } catch(error) {
        console.error("Fehler beim Erstellen der Aktivität:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Aktivität nicht erstellen' });
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
        
    } catch(error) {
        console.error("Fehler beim Senden der Daten:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Daten nicht senden' });
    }
});

/* 
* FUNKTIONIERT 
* Beispielaufruf in Postman: PUT http://localhost:3000/api/update-activity 
* mit body { "activityID": "677eab863a2c3c5edbd6bb4b", "properties": {"Vorname": "neuer eintrag"}}
*/
app.put('/api/update-activity', async (req, res) => {
    try {
        const { activityID, ...updateFields } = req.body; 

        if (!activityID) {
            return res.status(400).json({ error: "ActivityID ist erforderlich" });
        }

        const existingActivity = await getSingleActivity(activityID);
        if (!existingActivity) {
            return res.status(404).json({ error: "Aktivität nicht gefunden" });
        }

        const updated_activity = await updateActivity(activityID, updateFields);
        res.status(200).json(updated_activity);
    } catch (error) {
        console.error("Fehler beim Aktualisieren der Aktivität:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Aktivität nicht aktualisieren' });
    }
});

/* FUNKTIONIERT */
app.delete('/api/delete-activity/:id', async (req, res) => {
    try {
        const deleteMessage = await deleteActivity(req.params.id);
        res.status(200).json(deleteMessage);
    } catch (error) {
        console.error("Fehler beim Löschen der Aktivität:", error);
        res.status(500).json({ error: 'Serverfehler: Konnte Aktivität nicht löschen' });
    }
});

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
        const usersWithActivities = await getUsersWithActivities(); // Holt nur Nutzer mit `finished: true` Aktivitäten

        if (!usersWithActivities || usersWithActivities.length === 0) {
            return res.status(404).send("Keine abgeschlossenen Aktivitäten gefunden.");
        }

        // Erstelle eine neue Excel-Arbeitsmappe
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Abgeschlossene Aktivitäten");

        // Spalten definieren
        worksheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Aktivität", key: "activity", width: 30 },
            { header: "Erstellt am", key: "createdAt", width: 20 },
            { header: "Eigenschaften", key: "properties", width: 50 }
        ];

        // Zeilen mit Daten befüllen
        usersWithActivities.forEach(user => {
            user.activities.forEach(activity => {
                worksheet.addRow({
                    name: user.name,
                    activity: activity.activity,
                    createdAt: activity.createdAt,
                    properties: JSON.stringify(activity.properties, null, 2)
                });
            });
        });

        // Datei im Speicher erstellen
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader("Content-Disposition", "attachment; filename=abgeschlossene_aktivitäten.xlsx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.send(buffer);

    } catch (error) {
        console.error("Fehler beim Excel Export:", error);
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