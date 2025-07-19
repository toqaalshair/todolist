const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const dbConnection = async (collectionName) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db(process.env.DATABASE_NAME || 'tododb');
        const collection = db.collection(collectionName);
        console.log(`Connected to database: ${process.env.DATABASE_NAME || 'tododb'}`);
        return collection;
        client.close();
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }
};

module.exports = dbConnection;
