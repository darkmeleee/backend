import dotenv from 'dotenv';
const fs = require("fs");
const https = require("https");
dotenv.config();
import {app, apiRouter} from "./routes";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client';
var cors = require('cors')

// добавить защиту
const bodyParser = require("body-parser");

https
  .createServer(
		// Provide the private and public key to the server by reading each
		// file's content with the readFileSync() method.
    {
      key: fs.readFileSync("/root/backend/src/key.pem"),
      cert: fs.readFileSync("/root/backend/src/cert.pem"),
    },
    app
  )
  .listen(3002, () => {
    console.log("serever is runing at port 3000");
  });

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




