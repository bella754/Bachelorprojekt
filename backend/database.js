import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { formatDateTime } from './helper.js';


const uri = "mongodb+srv://admin:admin123@cluster0.jzmel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//--------------
// Users -------
//--------------

/* Get all users. FUNKTIONIERT */
export async function getAllUsers() {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const users = await usersCollection.find().toArray();

        // console.log("Found users in database: ", users);
        return users;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function getSingleUser(inputID) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ id: inputID })

        // console.log("Found user: ", user);
        return user;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function createUser(inputName, inputEmail, inputDepartment) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const user = await usersCollection.insertOne(
            {
                "name": inputName,
                "email": inputEmail,
                "department": inputDepartment
            }
        );

        // console.log("Created user: ", user);
        return user;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function updateUser() {
    
}

export async function deleteUser() {
    
}

//----------------------------------------------------------
// Activities ----------------------------------------------
//----------------------------------------------------------

/* all activities FUNKTIONIERT */ 
export async function getActivities() {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activities = await activitiesCollection.find().toArray();

        // console.log("Found activities: ", activities);
        return activities;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * Update activity. FUNKTIONIERT -- MUSS SPÄTER MIT RICHTIGEN 
 *                  ID's und ObjectId angepasst werden
 * @param {string} inputUserID - ID of the User.
 */
export async function getActivitiesFromUser(inputUserID) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activities = await activitiesCollection.find({ userID: Number(inputUserID) }).toArray();

        // console.log(`Found activities for user with userID ${inputUserID}: `, activities);
        return activities;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * Update activity. FUNKTIONIERT
 * @param {string} inputID - ID of the activity
 */
export async function getSingleActivity(inputID) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activity = await activitiesCollection.findOne({ _id: new ObjectId(inputID) })

        // console.log("Found user: ", user);
        return activity;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * Update activity. FUNKTIONIERT
 * @param {string} activityTitle - Name of the activity.
 * @param {Object} data - The data to update.
 */
export async function createActivity(activityTitle, inputData) {
    
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        if (activityTitle == "Aemter ud Gremienaktivität") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Aemter ud Gremienaktivität",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Ausstellungen und Messen") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Ausstellungen und Messen",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Begutachtungs und Beratungsfunktionen") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Begutachtungs und Beratungsfunktionen",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Einrichtung eines internationalen Studiengangs") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Einrichtung eines internationalen Studiengangs",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Elektronische Veröffentlichungen") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Elektronische Veröffentlichungen",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Lehre - Prüfungsleistungen Bachelor") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Lehre - Prüfungsleistungen Bachelor",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Organisation/Ausrichtung von Tagungen/Konferenzen") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Organisation/Ausrichtung von Tagungen/Konferenzen",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Publikationen in Sammelbänden") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Publikationen in Sammelbänden",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Publikationen in wissenschaftlichen Fachzeitschriften") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Publikationen in wissenschaftlichen Fachzeitschriften",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "TU-interne Promotionen (fakultätszentrale Erfassung)") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "TU-interne Promotionen (fakultätszentrale Erfassung)",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else if(activityTitle == "Vortrag auf Tagungen/Konferenzen") {
            const activity = await activitiesCollection.insertOne(
                {
                    activity: "Vortrag auf Tagungen/Konferenzen",
                    createdAt: formatDateTime(new Date()),
                    userID: 2,      // später über eingeloggten User
                    finished: false,
                    properties: inputData
                }
            );
    
            // console.log("Created activity: ", activity);
            return activity;
        } else {
            console.log("kein passendes schema");
            
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }      
}

/**
 * Update activity.FUNKTIONIERT
 * @param {string} inputID - ID of the activity.
 * @param {Object} updateInputs - Data to update.
 */
export async function updateActivity(inputID, updateInputs) {
    // console.log("in database.js with inputID", inputID);
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const updateData = {};
        Object.entries(updateInputs).forEach(([key, value]) => {
            updateData[`properties.${key}`] = value; 
        });

        // Update in der Datenbank durchführen
        const updated_activity = await activitiesCollection.updateOne(
            { _id: new ObjectId(inputID) },
            { $set: updateData } // Aktualisierung des "properties"-Objekts
        );

        // console.log("Update result:", updated_activity);
        return updated_activity;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * Delete activity. FUNKTIONIERT
 * @param {string} inputID - ID of the activity
 */
export async function deleteActivity(inputID) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        await activitiesCollection.deleteOne({ _id: new ObjectId(inputID) })

        // console.log("Found user: ", user);
        return `Activity with ${inputID} deleted`;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function getUsersWithActivities() {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const usersWithActivities = await usersCollection.aggregate([
            {
                $lookup: {
                    from: 'activities',          // Verbinde mit der activities-collection
                    localField: '_id',          // Nutzer-ID in der users-collection
                    foreignField: 'userID',     // Nutzer-ID in der activities-collection
                    as: 'activities'            // Ergebnisfeld für die Aktivitäten
                },
            },
        ]).toArray();

        // console.log("Users with activities: ", usersWithActivities);
        return usersWithActivities;
    } finally {
        // Ensure the client is closed
        await client.close();
    }
}

// import { MongoClient, ServerApiVersion } from 'mongodb';
// const uri = "mongodb+srv://admin:admin123@cluster0.jzmel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

