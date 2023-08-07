import express, {Express} from "express";
import bodyParser from "body-parser";
// добавить защиту
import morgan from "morgan";
import cors from "cors";



import { userRouter } from "./user";
import { dishRouter } from "./dish";
import { orderRouter } from "./order";






export const app: Express = express();

app.use(express.static('uploads'));
app.use(cors({
  origin: "*"
}))


import multer from "multer";
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
    }
  })
  const upload = multer({ storage: storage })
import fs from "fs";


app.post("/upload_files", upload.array("files"), uploadFiles);
function uploadFiles(req, res) {
    res.set('Access-Control-Allow-Origin', '*');

    res.json({ link: `http://localhost:3000/${req.files[0].filename}` });
    
}


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));



const port = 3000;

export const apiRouter = express.Router();

apiRouter.use("/user",userRouter);
apiRouter.use("/dish", dishRouter);
apiRouter.use("/order", orderRouter)

app.use("/api", apiRouter);


app.listen(port, () => {
    console.log(`Listening on ${port}`);
})