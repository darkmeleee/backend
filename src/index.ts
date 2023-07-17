import dotenv from 'dotenv';
dotenv.config();
import {app, apiRouter} from "./routes";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client';
// добавить защиту


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




