"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = __importDefault(require("knex"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = 3000;
const database = (0, knex_1.default)({
    client: '',
    connection: {
        host: '',
        user: '',
        password: '',
        database: ''
    }
});
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
//check if username already exist and create new user if not
app.post("/create-new-user-and-sign-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkIfUserNameAlreadyExist = yield database.select("username")
            .from("users")
            .where("username", "=", req.body.username);
        const arrayLength = checkIfUserNameAlreadyExist.length;
        if (arrayLength == 0) {
            const updateDatabase = yield database("users")
                .insert({ username: req.body.username, password: req.body.password, isSignedIn: true });
            const responseSuccess = res.json("success");
            return responseSuccess;
        }
        else {
            const responseUserAlreadyExist = res.json("username already exist");
            return responseUserAlreadyExist;
        }
    }
    catch (error) {
        res.json("error");
    }
}));
//update sign in status to true if correct password
app.post("/sign-in-existing-user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkCredentials = yield database.select("password")
            .from("users")
            .where("username", "=", req.body.username);
        if (checkCredentials[0].password === req.body.password) {
            const updateSignInStatus = yield database("users")
                .update("isSignedIn", true)
                .where("username", "=", req.body.username);
            const responseSuccess = res.json("success");
            return responseSuccess;
        }
        else {
            const responseWrongCredentials = res.json("Wrong credentials");
            return responseWrongCredentials;
        }
    }
    catch (error) {
        res.json("error");
    }
}));
//update sign in status to false
app.post("/sign-out", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signOut = yield database("users")
            .update("isSignedIn", false)
            .where("username", "=", req.body.username);
        const responseSuccess = res.json("success");
        return responseSuccess;
    }
    catch (error) {
        res.json("error");
    }
}));
//check if signed in and update score if signed in
app.post("/check-if-signed-in", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkIfSignedIn = yield database.select("isSignedIn", "score")
            .from("users")
            .where("username", "=", req.body.username);
        const newScore = Number(checkIfSignedIn[0].score) + 1;
        if (checkIfSignedIn[0].isSignedIn === true) {
            const updateScore = yield database("users")
                .update("score", newScore)
                .where("username", "=", req.body.username);
            const responseSuccess = res.json("success");
            return responseSuccess;
        }
        else {
            const responseUserNotSignedIn = res.json("User is not signed in");
            return responseUserNotSignedIn;
        }
    }
    catch (error) {
        res.json("error");
    }
}));
//check if user is signed in and send score if signed in
app.post("/check-if-signed-in-and-get-score", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkIfSignedIn = yield database.select("isSignedIn", "score")
            .from("users")
            .where("username", "=", req.body.username);
        const score = Number(checkIfSignedIn[0].score);
        if (checkIfSignedIn[0].isSignedIn === true) {
            const responseSuccess = res.json(score);
            return responseSuccess;
        }
    }
    catch (error) {
        res.json("error");
    }
}));
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
