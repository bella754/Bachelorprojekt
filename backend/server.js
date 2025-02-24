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
        console.error("Error getting users:", error);
        res.status(500).json({ error: 'Error getting users' });
    }
});

/** 
 * FUNKTIONIERT 
 */
app.get('/api/get-user/:userID', async (req, res) => {
    try{
        if (!req.params.userID) {
            return res.status(404).send("No userID provided")
        }

        const user = await getSingleUser(req.params.userID);

        if (!user) {
            return res.status(404).send("User not found")
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).send("Error while getting user");
    }
});

/**
 * FUNKTINOIERT
 */
app.post('/api/new-user', async (req, res) => {
    try {
        const { name, email, department, role } = req.body;
        
        if (!name?.trim() || !email?.trim() || !department?.trim()) {
            return res.status(400).json({ error: "Invalid input data - Fields must not be empty" });
        }

        const new_user_message = await createUser(name, email, department, role);
        return res.status(201).json(new_user_message);
    } catch(error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

app.put('/api/update-user', async (req, res) => {
    try {
        const { userID, ...updateFields } = req.body; 
        // console.log("userid und updateFields: ", userID, updateFields);
        
        if (!userID?.trim()) {
            return res.status(400).json({ error: "Invalid user id - Fields must not be empty" });
        } else if (!updateFields) {
            return res.status(400).json({ error: "No data to update" });
        }

        const updatedUser = await updateUser(userID, updateFields);

        if (!updatedUser) {
            return res.status(400).send("Couldnt update user")
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Can't update user");
    }
});

app.delete('/api/delete-user/:userID', async (req, res) => {
    try {
        if (!req.params.userID) {
            return res.status(400).send("No input user id");
        }
        const deleteMessage = await deleteUser(req.params.userID);

        if (!deleteMessage) {
            return res.status(400).send("Couldnt delete user")
        }
        
        return res.status(200).json(deleteMessage);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Can't delete user");
    }
});

//-----------------------------------------------------
// Activity CRUD Operations ---------------------------
//-----------------------------------------------------

/* FUNKTIONIERT */
app.get('/api/all-activities', async (req, res) => {
    try {
        const activities = await getActivities();    
        return res.status(200).json(activities);
    } catch (error) {
        console.error("Error getting all activities:", error);
        res.status(500).send("Can't get all activities");
    }
})

/* FUNKTIONIERT */
app.get('/api/user-all-activities/:userID', async (req, res) => {
    try {
        if (!req.params.userID) {
            return res.status(400).send("No user id provided");
        }
        const userID = req.params.userID;

        const activities = await getActivitiesFromUser(userID);

        console.log("activities from user: ", activities);

        if (!activities || activities.length === 0) {
            return res.status(404).send("No activities found");
        }

        return res.status(200).json(activities)
    } catch(error) {
        console.error("Error getting all activities from user:", error);
        res.status(500).send("Can't get all activities from user");
    }
        
    
});

/* FUNKTIONIERT */
app.get('/api/activity/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).send("No input id");
        }

        const activity = await getSingleActivity(req.params.id);
        
        if (!activity) {
            return res.status(404).send("Activity not found");
        }

        return res.status(200).json(activity);
    } catch (error) {
        console.error("Error getting all activity:", error);
        res.status(500).send("Can't get all activity");
    } 
});

/**
* FUNKTIONIERT
* @TODO : ausstellungen und orga mit bool werten müssen noch geändert 
*         dann zum laufen gebracht werdens
*/
app.post('/api/new-activity/:userID', async (req, res) => {   

    if (!req.params.userID) {
        return res.status(400).send("No user id provided");
    }

    const userID = req.params.userID;

    const { activityTitle, ...activityData } = req.body;

    if (!activityTitle) {
        return res.status(400).json({ error: "Kein schemaTitle im Request-Body angegeben." });
    } else if (!activityData) {
        return res.status(400).json({ error: "Keine Daten im Request-Body angegeben." });
    }

    const validate = validators[activityTitle];
    //console.log("activityTitle: ", activityTitle);
    //console.log("validators: ", validators);
    //console.log("validators[activityTitle]: ", validate);
    
    
    
    if (!validate) {
        return res.status(400).json({ error: "Ungültiger schemaTitle oder Schema nicht gefunden." });
    }

    const isValid = validate(activityData);
    if (!isValid.valid) {
        return res.status(400).json({ errors: isValid.errors });
    }

    try {
        const newActivity = await createActivity(activityTitle, activityData, userID);
        // console.log("New activity created:", newActivity);
        return res.status(200).json(newActivity);
    } catch (error) {
        console.error("Error creating activity:", error);
        res.status(500).json({ error: 'Error creating activity' });
    }
});

/** 
* FUNKTIONIERT
*/ 
app.post('/api/send-data/:userID', async (req, res) => {   
    if (!req.params.userID) {
        return res.status(400).send("No user id provided");
    }

    const userID = req.params.userID;
    //console.log("userID in backend: ", userID);
    
    try {
        const result = await setFinishState(userID);

        return res.status(201).json(result);
        
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
    try {
        const { activityID, ...updateFields } = req.body; 

        if (!activityID?.trim()) {
            return res.status(400).json({ error: "Invalid activity id - Fields must not be empty" });
        } else if (!updateFields) {
            return res.status(400).json({ error: "No data to update" });
        }

        const updated_activity = await updateActivity(activityID, updateFields);
        
        if (!updated_activity) {
            return res.status(400).send("Activity couldnt get updated")
        }

        return res.status(200).json(updated_activity);
    } catch (error) {
        console.error("Error updating activity:", error);
        res.status(500).json({ error: 'Error updating activity' });
    }
});

/* FUNKTIONIERT */
app.delete('/api/delete-activity/:id', async (req, res) => {
    try {
        if(!req.params.id) {
            return res.status(400).send("No activity id provided")
        }

        const deleteMessage = await deleteActivity(req.params.id);

        if (!deleteMessage) {
            return res.status(400).send("Couldnt delete activity")
        }

        return res.status(200).json(deleteMessage);
    } catch (error) {
        console.error("Error deleting activity:", error);
        res.status(500).json({ error: 'Error deleting activity' });
    }
});

/** 
* FUNKTIONIERT 
*/ 
app.get('/api/users-with-activities', async (req, res) => {
    try {
        const usersWithActivities = await getUsersWithActivities();

        if (!usersWithActivities) {
            return res.status(404).send("No users with activities")
        }
        return res.status(200).json(usersWithActivities);
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