import e from "express";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcrypt-nodejs";

import { handleSignin } from "./controllers/signin.js"
import { handleRegister } from "./controllers/register.js";
import { handleProfileUpdate } from "./controllers/profile.js";
import { handleImage, handleApiCall } from './controllers/image.js';

const db = knex({
    client:'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
});

const app = e();

app.use(cors());
app.use(e.json());

app.get('/',(req,res)=>{res.send('Its working')})
app.post('/signin', (req,res) => handleSignin(req,res, db,bcrypt))
app.post('/register', (req,res) => handleRegister(req,res,db,bcrypt))
app.post('/profile/:id', (req,res) => handleProfileUpdate(req,res,db))
app.put('/image', (req,res) => handleImage(req,res,db))
app.post('/imageurl',(req,res) => handleApiCall(req,res))

app.listen(3000,() =>{
    console.log('server is running on port 3000')
});