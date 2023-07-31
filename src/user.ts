import express from "express";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client';
const password = 11111;
// добавить защиту

export const userRouter = express.Router();

userRouter.get('/get',
    async (req, res) => {
        if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
            return res.status(400).send({error: "id not passed"});
        const user = await prisma.user.findFirst({
            where: {
                id: parseInt(req.query.id) ,
            }
        });
        if (!user) res.status(404);
        res.send(user ?? {error: "user not found"});
    });

    userRouter.get('/getAdmin',
    async (req, res) => {
        if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
            return res.status(400).send({error: "id not passed"});
        const user = await prisma.admin.findFirst({
            where: {
                id: parseInt(req.query.id) ,
            }
        });
        if (!user) res.status(404);
        res.send(user ?? {error: "user not found"});
    });



userRouter.get("/getAmount",
    async (req,res) => {
        const userCount = await prisma.user.count()
        res.send({"count": userCount});
    }

)



userRouter.get('/getAll',
    async(req,res) => {
        const users = await prisma.user.findMany()
        res.send(users);
    }
)

userRouter.post('/create',
    async (req, res) => {
        let user: Prisma.UserCreateInput
        user = {
            name: req.body.name,
            number: req.body.number,
            spent: req.body.spent


        }
        const newUser = await prisma.user.create({
            data: user
        })
        res.send(newUser);
    }

)

userRouter.post("/createAdmin",
    async(req,res) => {
        let user: Prisma.AdminCreateInput
        user = {
            login: req.body.login,
            password: req.body.password
        }
        const newUser = await prisma.admin.create({
            data: user
        })
        res.send(newUser);
    }
)



userRouter.post("/ban",
    async(req,res) => {
        const user = await prisma.user.update({
            where: {
                id: req.body.id,
            },
            data: {
                // role : banned
            }
        });
    }
)

/*userRouter.get('/delete', 
    async (req,res) => {
        if(req.body.password == password){ 
        await prisma.user.delete({where: {
            id: req.body.id
        }})
        res.sendStatus(200);

        
    }
    else{
        res.send("denied")
    }
    }    

)*/

userRouter.post("/update",
    async (req,res) => {
        let update: any = {};
    
        if(req.body.hasOwnProperty("name")) {
            update["name"] = req.body.name;
        }
    
        if(req.body.hasOwnProperty("number")) {
            update["number"] = req.body.number;
        }
    
        if(req.body.hasOwnProperty("spent")) {
            update["spent"] = req.body.spent;
        }

        if(req.body.hasOwnProperty("role")){
            update["role"] = req.body.role;
        }
    
        const user = await prisma.user.update({
            where: {
                id: req.body.id,
            },
            data: update
        });
        res.send(user);
    }

)

