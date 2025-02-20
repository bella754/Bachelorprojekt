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
        
        return users;
    } catch(error) {
        console.error("Error in getAllUsers:", error);
        throw new Error("Failed to get all users"); 
    } finally {
        await client.close();
    }
}

/**
 * FUNKTIONIERT
 * @param {String} inputID - id des gesuchten Nutzers
 */
export async function getSingleUser(inputID) {
    const userID = ObjectId.createFromHexString(inputID);

    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ _id: userID })

        return user;
    } catch(error) {
        console.error("Error in getSingleUser:", error);
        throw new Error("Failed to get single user with id"); 
    } finally {
        await client.close();
    }
}

/**
 * FUNKTIONIERT
 * @param {String} inputEmail - email des gesuchten Nutzers
 */
export async function getSingleUserEmail(inputEmail) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const user = await usersCollection.findOne({ email: inputEmail });
        
        return user;
    } catch(error) {
        console.error("Error in getSingleUserEmail:", error);
        throw new Error("Failed to get single user with email"); 
    } finally {
        await client.close();
    }
}

/**
 * FUNKTIONIERT
 * @param {String} inputName - name für den nutzer
 * @param {String} inputEmail - email für den Nutzers
 * @param {String} inputDepartment - department, in dem der nutzer arbeitet
 * @param {String} inputRole - Rolle, die der Benutzer bekommen soll - default ist Standard User
 */
export async function createUser(inputName, inputEmail, inputDepartment, inputRole) {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        let user = await usersCollection.insertOne({
            "name": inputName,
            "email": inputEmail,
            "department": inputDepartment,
            "role": inputRole || "Standard User"
        });

        return user;
    } catch (error) {
        console.error("Error in createUser:", error);
        throw new Error("Failed to create user"); 
    } finally {
        await client.close();
    }
}


/**
 * FUNKTIONIERT
 * @param {String} inputID - id des nuters, der gelöscht werden soll 
 * @param {Object} updateFields - alle Felder, die bearbeitet werden sollen
*/
export async function updateUser(inputID, updateFields) {    
    const userID = ObjectId.createFromHexString(inputID);
    console.log("inputid und updatefields in database.js: ", inputID, updateFields);
    console.log("userID after transform: ", userID);
    

    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const updatedUser = await usersCollection.updateOne(
            { _id: userID },
            { $set: updateFields } 
        );

        console.log("updatedUser: ", updatedUser);
        
        return updatedUser;
    } catch (error) {
        console.error("Error in updateUser:", error);
        throw new Error("Failed to update user"); 
    } finally {
        await client.close();
    }
}

/**
 * FUNKTIONIERT
 * @param {String} inputID - id des nuters, der gelöscht werden soll 
 */
export async function deleteUser(inputID) {
    const userID = ObjectId.createFromHexString(inputID);

    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        await usersCollection.deleteOne({ _id: userID })

        return `User with ${inputID} deleted`;
    } catch (error) {
        console.error("Error in deleteUser:", error);
        throw new Error("Failed to delete user"); 
    } finally {
        await client.close();
    }
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
    } catch(error) {
        console.error("Error in getActivities:", error);
        throw new Error("Failed to get all activities"); 
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * get activities from one user. FUNKTIONIERT
 * @param {String} inputUserID - ID of the User.
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
    } catch(error) {
        console.error("Error in getActivitiesFromUser:", error);
        throw new Error("Failed to get all activities from user with userID: ", inputUserID); 
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * get single activity
 * @param {String} inputID - ID of the activity
 */
export async function getSingleActivity(inputID) {
    // console.log("in database getSingleActivity with id: ", inputID);
    const activityID = ObjectId.createFromHexString(inputID);

    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activity = await activitiesCollection.findOne({ _id: activityID })

        console.log("Found activity: ", activity);
        return activity;
    } catch(error) {
        console.error("Error in getSingleActivity:", error);
        throw new Error("Failed to get activity"); 
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

/**
 * create activity. FUNKTIONIERT
 * @param {String} activityTitle - Name of the activity.
 * @param {Object} data - The data to update.
 * @param {String} inputUserID - ID of the user who creates the activity 
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
    } catch(error) {
        console.error("Error in createActivity:", error);
        throw new Error("Failed to create activity"); 
    }finally {
        await client.close();
    }
}

/**
 * Update activity.FUNKTIONIERT
 * @param {String} inputID - ID of the activity.
 * @param {Object} updateInputs - Data to update.
 */
export async function updateActivity(inputID, updateInputs) {
    const activityID = new ObjectId(inputID);

    try {
        await client.connect();
        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        // Prüfen, ob die Aktivität existiert und ob sie bearbeitet werden darf
        const activity = await activitiesCollection.findOne({ _id: activityID });

        if (!activity) {
            return { success: false, error: "Aktivität nicht gefunden." };
        }

        if (activity.finished === true) {
            return { success: false, error: "Aktivität ist abgeschlossen und kann nicht mehr bearbeitet werden." };
        }

        // Update-Daten vorbereiten
        const updateData = {};
        Object.entries(updateInputs).forEach(([key, value]) => {
            updateData[`properties.${key}`] = value; 
        });

        // Update in der Datenbank durchführen
        const updatedActivity = await activitiesCollection.updateOne(
            { _id: activityID },
            { $set: updateData }
        );

        return updatedActivity;
    } catch(error) {
        console.error("Error in updateActivity:", error);
        throw new Error("Failed to update activity"); 
    } finally {
        await client.close();
    }
}

/**
 * Delete activity. FUNKTIONIERT
 * @param {String} inputID - ID of the activity
 */
export async function deleteActivity(inputID) {
    const activityID = ObjectId.createFromHexString(inputID);

    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        await activitiesCollection.deleteOne({ _id: activityID })

        // console.log("Found user: ", user);
        return `Activity with ${inputID} deleted`;
    } catch (error) {
        console.error("Error deleting activity:", error);
        throw new Error("Failed to delete activity"); 
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

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
    } catch (error) {
        console.error("Error getting data:", error);
        throw new Error("Failed to get data"); 
    } finally {
        await client.close();
    }
}


/**
 * "send data". FUNKTIONIERT 
 * @param {String} inputID 
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

        return result;
    } catch (error) {
        console.error("Error sending data:", error);
        throw new Error("Failed to send data"); 
    } finally {
        await client.close();
    }
}



// import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb';
// import { formatDateTime } from './helper.js';
// import dotenv from 'dotenv';
// dotenv.config();


// const uri = process.env.DATABASE_URI;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// //--------------
// // Users -------
// //--------------

// /* Get all users. FUNKTIONIERT */
// export async function getAllUsers() {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const usersCollection = database.collection('users');

//         const users = await usersCollection.find().toArray();

//         // console.log("Found users in database: ", users);
//         return users;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// export async function getSingleUser(inputID) {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const usersCollection = database.collection('users');

//         const user = await usersCollection.findOne({ _id: inputID })

//         // console.log("Found user: ", user);
//         return user;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// /* Get users via email. FUNKTIONIERT */
// export async function getSingleUserEmail(inputEmail) {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const usersCollection = database.collection('users');

//         const user = await usersCollection.findOne({ email: inputEmail });
//         // console.log("user in database.js: ", user);
        

//         // console.log("Found user: ", user);
//         return user;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }



// export async function createUser(inputName, inputEmail, inputDepartment, inputRole) {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const usersCollection = database.collection('users');

//         let user;
//         if (inputRole) {
//             user = await usersCollection.insertOne(
//                 {
//                     "name": inputName,
//                     "email": inputEmail,
//                     "department": inputDepartment,
//                     "role": inputRole
//                 }
//             );
//         } else {
//             user = await usersCollection.insertOne(
//                 {
//                     "name": inputName,
//                     "email": inputEmail,
//                     "department": inputDepartment,
//                     "role": "Standard User"
//                 }
//             );
//         }
//         // console.log("Created user: ", user);
//         return user;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// export async function updateUser() {
    
// }

// export async function deleteUser(inputID) {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('users');

//         await activitiesCollection.deleteOne({ _id: inputID })

//         // console.log("Found user: ", user);
//         return `Activity with ${inputID} deleted`;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// //----------------------------------------------------------
// // Activities ----------------------------------------------
// //----------------------------------------------------------

// /* all activities FUNKTIONIERT */ 
// export async function getActivities() {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         const activities = await activitiesCollection.find().toArray();

//         // console.log("Found activities: ", activities);
//         return activities;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// /**
//  * get activities from one user. FUNKTIONIERT
//  * @param {String} inputUserID - ID of the User.
//  * um alle aktivitäten von einem user zu bekommen
//  */
// export async function getActivitiesFromUser(inputUserID) {
//     // console.log("userID in database.js: ", inputUserID);
//     const userID = ObjectId.createFromHexString(inputUserID);

//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         const activities = await activitiesCollection.find({ userID: userID }).toArray();
//         // console.log(`Database: Found activities for user with userID ${inputUserID}: `, activities);
//         return activities;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// /**
//  * get single activity
//  * @param {ObjectId} inputID - ID of the activity
//  */
// export async function getSingleActivity(inputID) {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         const activity = await activitiesCollection.findOne({ _id: inputID })

//         // console.log("Found user: ", user);
//         return activity;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// /**
//  * create activity. FUNKTIONIERT
//  * @param {string} activityTitle - Name of the activity.
//  * @param {Object} data - The data to update.
//  */
// export async function createActivity(activityTitle, inputData, inputUserID) {
//     const userID = ObjectId.createFromHexString(inputUserID);

//     try {
//         await client.connect();
//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         const activity = {
//             activity: activityTitle,
//             createdAt: formatDateTime(new Date()),
//             userID: userID,  
//             finished: false,
//             properties: inputData
//         };

//         const result = await activitiesCollection.insertOne(activity);
//         // console.log("Created activity:", result);
//         return result;
//     } finally {
//         await client.close();
//     }
// }

// /**
//  * Update activity.FUNKTIONIERT
//  * @param {ObjektID} inputID - ID of the activity.
//  * @param {Object} updateInputs - Data to update.
//  */
// export async function updateActivity(inputID, updateInputs) {
//     // console.log("in database.js with inputID", inputID);
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         const updateData = {};
//         Object.entries(updateInputs).forEach(([key, value]) => {
//             updateData[`properties.${key}`] = value; 
//         });

//         // Update in der Datenbank durchführen
//         const updated_activity = await activitiesCollection.updateOne(
//             { _id: inputID },
//             { $set: updateData } // Aktualisierung des "properties"-Objekts
//         );

//         // console.log("Update result:", updated_activity);
//         return updated_activity;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// /**
//  * Delete activity. FUNKTIONIERT
//  * @param {ObjektID} inputID - ID of the activity
//  */
// export async function deleteActivity(inputID) {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         await activitiesCollection.deleteOne({ _id: inputID })

//         // console.log("Found user: ", user);
//         return `Activity with ${inputID} deleted`;
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }

// // ist die richtige für All_Activities.vue
// /*export async function getUsersWithActivities() {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const usersCollection = database.collection('users');

//         const usersWithActivities = await usersCollection.aggregate([
//             {
//                 $lookup: {
//                     from: 'activities',          // Verbinde mit der activities-collection
//                     localField: '_id',          // Nutzer-ID in der users-collection
//                     foreignField: 'userID',     // Nutzer-ID in der activities-collection
//                     as: 'activities'            // Ergebnisfeld für die Aktivitäten
//                 },
//             },
//         ]).toArray();

//         // console.log("Users with activities: ", usersWithActivities);
//         return usersWithActivities;
//     } finally {
//         // Ensure the client is closed
//         await client.close();
//     }
// }*/

// /**
//  * FUNKTIONIERT 
//  */
// export async function getUsersWithActivities() {
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const usersCollection = database.collection('users');

//         const usersWithActivities = await usersCollection.aggregate([
//             {
//                 $lookup: {
//                     from: 'activities', 
//                     localField: '_id',   // `_id` aus `users`
//                     foreignField: 'userID',  // `userID` als ObjectId in `activities`
//                     as: 'activities'
//                 }
//             },
//             {
//                 $addFields: {
//                     activities: {
//                         $filter: {
//                             input: "$activities",
//                             as: "activity",
//                             cond: { $eq: ["$$activity.finished", true] }  // Nur Aktivitäten mit `finished: true`
//                         }
//                     }
//                 }
//             }
//         ]).toArray();

//         // console.log("Users with finished activities: ", usersWithActivities);
//         return usersWithActivities;
//     } finally {
//         await client.close();
//     }
// }


// /**
//  * "send data". FUNKTIONIERT 
//  * @param {ObjektID} inputID 
//  */
// export async function setFinishState(inputID) {
//     // console.log("userID in database.js: ", inputID);
//     const userID = ObjectId.createFromHexString(inputID);
    
//     try {
//         await client.connect();

//         const database = client.db('Horus');
//         const activitiesCollection = database.collection('activities');

//         // Update alle Aktivitäten des Nutzers mit finished: false auf finished: true
//         const result = await activitiesCollection.updateMany(
//             { userID: userID, finished: false },  // Bedingung: Passende Aktivitäten des Nutzers finden
//             { $set: { finished: true } }  // Update: Setze finished auf true
//         );

//         console.log(`Updated ${result.modifiedCount} activities to finished.`);

//         return result;
//     } catch (error) {
//         console.error("Error updating activities:", error);
//     } finally {
//         await client.close();
//     }
// }


// // import { MongoClient, ServerApiVersion } from 'mongodb';
// // const uri = "mongodb+srv://admin:admin123@cluster0.jzmel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// // const client = new MongoClient(uri, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   }
// // });
// // async function run() {
// //   try {
// //     // Connect the client to the server	(optional starting in v4.7)
// //     await client.connect();
// //     // Send a ping to confirm a successful connection
// //     await client.db("admin").command({ ping: 1 });
// //     console.log("Pinged your deployment. You successfully connected to MongoDB!");
// //   } finally {
// //     // Ensures that the client will close when you finish/error
// //     await client.close();
// //   }
// // }
// // run().catch(console.dir);

