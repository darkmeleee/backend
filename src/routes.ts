import express, {Express} from "express";
import bodyParser from "body-parser";
// добавить защиту

import passport from "passport";
import cors from "cors";
import { userRouter } from "./user";
import { dishRouter } from "./dish";
import { orderRouter } from "./order";


export const app: Express = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cors());

const port = 3000;

export const apiRouter = express.Router();

apiRouter.use("/user",userRouter);
apiRouter.use("/dish", dishRouter);
apiRouter.use("/order", orderRouter)

app.use("/api", apiRouter);


app.listen(port, () => {
    console.log(`Listening on ${port}`);
})