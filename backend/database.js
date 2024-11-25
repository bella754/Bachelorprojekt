import { MongoClient, ServerApiVersion } from 'mongodb';

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

export async function getAllUsers() {
    try {
        await client.connect();

        const database = client.db('Horus');
        const usersCollection = database.collection('users');

        const users = await usersCollection.find().toArray();

        console.log("Found users: ", users);
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

        console.log("Found user: ", user);
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

        console.log("Created user: ", user);
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

//--------------
// Activities --
//--------------

export async function getActivities() {
    try {
        await client.connect();

        const database = client.db('Horus');
        const activitiesCollection = database.collection('activities');

        const activities = await activitiesCollection.find().toArray();

        console.log("Found activities: ", activities);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

export async function getSingleActivity() {
    
}

export async function createActivity() {
    
}

export async function updateActivity() {

}

export async function deleteActivity() {

}
