const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();


app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://ksricharanrao_db_user:xOSc9N9ZvexNH93N@cluster0.ubb8rvf.mongodb.net/?appName=Cluster0')
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.log("Error connecting to DB", err);
});


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true } 
});

const UserModel = mongoose.model("users", UserSchema);


app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        
        const userExist = await UserModel.findOne({ email: email });
        if(userExist) {
            return res.json("Already has an account");
        }

        
        const newUser = await UserModel.create({ name, email, password });
        res.json("Account Created");

    } catch (err) {
        console.log(err);
        res.json(err);
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if(user) {
            
            if(user.password === password) {
                res.json("Success");
            } else {
                res.json("Wrong password");
            }
        } else {
            res.json("No user found");
        }

    } catch (err) {
        console.log(err);
        res.json("Error");
    }
});


app.listen(3001, () => {
    console.log("Server is running on port 3001");
});