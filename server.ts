import express, { Express, Request, Response } from "express";
import cors from "cors";
import knex from "knex";
import bodyParser from "body-parser";

const port = 3000;

const database = knex({
    client: '',
    connection: {
      host : '',
      user : '',
      password : '',
      database : ''
    }
});

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());


//check if username already exist and create new user if not
app.post("/create-new-user-and-sign-in", async (req: Request, res: Response) => {
    try {
        const checkIfUserNameAlreadyExist = await database.select("username")
        .from("users")
        .where("username", "=", req.body.username);
        const arrayLength = checkIfUserNameAlreadyExist.length;
        if (arrayLength == 0){
            const updateDatabase = await database("users")
            .insert({username: req.body.username, password: req.body.password, isSignedIn: true});
            const responseSuccess = res.json("success");
            return responseSuccess;
        }
        else {
            const responseUserAlreadyExist = res.json("username already exist");
            return responseUserAlreadyExist;
        }
    }
    catch(error){
        res.json("error");
    }
});


//update sign in status to true if correct password
app.post("/sign-in-existing-user", async (req: Request, res: Response) => {
    try {
        const checkCredentials = await database.select("password")
        .from("users")
        .where("username", "=", req.body.username);
        if (checkCredentials[0].password === req.body.password){
            const updateSignInStatus = await database("users")
            .update("isSignedIn", true)
            .where("username", "=", req.body.username)
            const responseSuccess = res.json("success");
            return responseSuccess;
        }
        else {
            const responseWrongCredentials = res.json("Wrong credentials");
            return responseWrongCredentials;
        }
    }
    catch(error){
        res.json("error");
    }
});


//update sign in status to false
app.post("/sign-out", async (req: Request, res: Response) => {
    try {
        const signOut = await database("users")
        .update("isSignedIn", false)
        .where("username", "=", req.body.username);
        const responseSuccess = res.json("success");
        return responseSuccess;
    }
    catch(error){
        res.json("error");
    }
});


//check if signed in and update score if signed in
app.post("/check-if-signed-in", async (req: Request, res: Response) => {
    try {
        const checkIfSignedIn = await database.select("isSignedIn", "score")
        .from("users")
        .where("username", "=", req.body.username);
        const newScore = Number(checkIfSignedIn[0].score) + 1;
        if (checkIfSignedIn[0].isSignedIn === true){
            const updateScore = await database("users")
            .update("score", newScore)
            .where("username", "=", req.body.username)
            const responseSuccess = res.json("success");
            return responseSuccess;
        }
        else {
            const responseUserNotSignedIn = res.json("User is not signed in");
            return responseUserNotSignedIn;
        }
    }
    catch(error){
        res.json("error");
    }
});


//check if user is signed in and send score if signed in
app.post("/check-if-signed-in-and-get-score", async (req: Request, res: Response) => {
    try {
        const checkIfSignedIn = await database.select("isSignedIn", "score")
        .from("users")
        .where("username", "=", req.body.username);
        const score = Number(checkIfSignedIn[0].score);
        if (checkIfSignedIn[0].isSignedIn === true){
            const responseSuccess = res.json(score);
            return responseSuccess;
        }
    }
    catch(error){
        res.json("error");
    }
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});