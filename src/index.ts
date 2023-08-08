import dotenv from 'dotenv';
dotenv.config();
import {app, apiRouter} from "./routes";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client';
var cors = require('cors')

// добавить защиту
const bodyParser = require("body-parser");

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(bodyParser.json());





type ExpressUser = User;

declare global {
    namespace Express {
        interface User extends ExpressUser {}
    }
}

app.get('/', (req, res) => {
    res.send({
        hello: "world",
    });
});




