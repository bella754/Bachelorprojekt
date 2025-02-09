import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
import { formatDateTime } from './helper.js';
import dotenv from 'dotenv';
dotenv.config();


const uri = process.env.DATABASE_URI;

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

/* Get users via email. FUNKTIONIERT */
export async function getSingleUserEmail(inputEmail) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ email: inputEmail });
        // console.log("user in database.js: ", user);
        

        // console.log("Found user: ", user);
        return user;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}



export async function createUser(inputName, inputEmail, inputDepartment, inputRole) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        let user;
        if (inputRole) {
            user = await usersCollection.insertOne(
                {
                    "name": inputName,
                    "email": inputEmail,
                    "department": inputDepartment,
                    "role": inputRole
                }
            );
        } else {
            user = await usersCollection.insertOne(
                {
                    "name": inputName,
                    "email": inputEmail,
                    "department": inputDepartment,
                    "role": "Standard User"
                }
            );
        }
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
 * get activities from one user. FUNKTIONIERT
 * @param {string} inputUserID - ID of the User.
 * um alle aktivitäten von einem user zu bekommen
 */
export async function getActivitiesFromUser(inputUserID) {
    // console.log("userID in database.js: ", inputUserID);
    const userID = ObjectId.createFromHexString(inputUserID);

    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activities = await activitiesCollection.find({ userID: userID }).toArray();
        // console.log(`Database: Found activities for user with userID ${inputUserID}: `, activities);
        return activities;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * get single activity
 * @param {ObjectId} inputID - ID of the activity
 */
export async function getSingleActivity(inputID) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activity = await activitiesCollection.findOne({ _id: inputID })

        // console.log("Found user: ", user);
        return activity;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * create activity. FUNKTIONIERT
 * @param {string} activityTitle - Name of the activity.
 * @param {Object} data - The data to update.
 */
export async function createActivity(activityTitle, inputData, inputUserID) {
    const userID = ObjectId.createFromHexString(inputUserID);

    try {
        await client.connect();
        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activity = {
            activity: activityTitle,
            createdAt: formatDateTime(new Date()),
            userID: userID,  
            finished: false,
            properties: inputData
        };

        const result = await activitiesCollection.insertOne(activity);
        // console.log("Created activity:", result);
        return result;
    } finally {
        await client.close();
    }
}

/**
 * Update activity.FUNKTIONIERT
 * @param {ObjektID} inputID - ID of the activity.
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
            { _id: inputID },
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
 * @param {ObjektID} inputID - ID of the activity
 */
export async function deleteActivity(inputID) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        await activitiesCollection.deleteOne({ _id: inputID })

        // console.log("Found user: ", user);
        return `Activity with ${inputID} deleted`;
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

// ist die richtige für All_Activities.vue
/*export async function getUsersWithActivities() {
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
}*/

/**
 * FUNKTIONIERT 
 */
export async function getUsersWithActivities() {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const usersWithActivities = await usersCollection.aggregate([
            {
                $lookup: {
                    from: 'activities', 
                    localField: '_id',   // `_id` aus `users`
                    foreignField: 'userID',  // `userID` als ObjectId in `activities`
                    as: 'activities'
                }
            },
            {
                $addFields: {
                    activities: {
                        $filter: {
                            input: "$activities",
                            as: "activity",
                            cond: { $eq: ["$$activity.finished", true] }  // Nur Aktivitäten mit `finished: true`
                        }
                    }
                }
            }
        ]).toArray();

        // console.log("Users with finished activities: ", usersWithActivities);
        return usersWithActivities;
    } finally {
        await client.close();
    }
}


/**
 * "send data". FUNKTIONIERT 
 * @param {ObjektID} inputID 
 */
export async function setFinishState(inputID) {
    // console.log("userID in database.js: ", inputID);
    const userID = ObjectId.createFromHexString(inputID);
    
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        // Update alle Aktivitäten des Nutzers mit finished: false auf finished: true
        const result = await activitiesCollection.updateMany(
            { userID: userID, finished: false },  // Bedingung: Passende Aktivitäten des Nutzers finden
            { $set: { finished: true } }  // Update: Setze finished auf true
        );

        console.log(`Updated ${result.modifiedCount} activities to finished.`);

        return result;
    } catch (error) {
        console.error("Error updating activities:", error);
    } finally {
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

