const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const uri = process.env.MONGO_URI;
const clientOptions = {
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
        WriteConcern: { w: "majority", wtimeout: 2500 },
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
};
async function connectDB() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = connectDB;
