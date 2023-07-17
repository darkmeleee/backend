import express from "express";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client'; 

// добавить защиту

export const dishRouter = express.Router();

dishRouter.get('/get',
    async (req, res) => {
        if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
            return res.status(400).send({error: "id not passed"});
        const dish = await prisma.dish.findFirst({
            where: {
                id: parseInt(req.query.id) ,
            }
        });
        if (!dish) res.status(404);
        res.send(dish ?? {error: "dish not found"});
    });

dishRouter.post('/create',
    async (req, res) => {
        let dish: Prisma.DishCreateInput
        dish = {
            price: req.body.price,
            type: req.body.type,
            description: req.body.description,
            name: req.body.name,
            imageUrl: req.body.imageUrl


        }
        const newDish = await prisma.dish.create({
            data: dish
        })
        res.send(newDish);
    }

)

dishRouter.post("/update",
    async (req,res) => {
        let update: any = {};
    
        if(req.body.hasOwnProperty("name")) {
            update["name"] = req.body.name;
        }
    
        if(req.body.hasOwnProperty("price")) {
            update["price"] = req.body.price;
        }
    
        if(req.body.hasOwnProperty("description")) {
            update["description"] = req.body.description;
        }

        if(req.body.hasOwnProperty("type")){
            update["type"] = req.body.type;
        }
    
        const dish = await prisma.dish.update({
            where: {
                id: req.body.id,
            },
            data: update
        });
        res.send(dish);
    }

)

dishRouter.get('/getAll',
    async(req,res) => {
        const users = await prisma.dish.findMany()
        res.send(users);
    }
)

dishRouter.post('/delete',
    async(req,res) => {
        const deleteUser = await prisma.dish.delete({
            where: {
                id: parseInt(req.body.id)
            }
        })
        res.send(deleteUser);
    }
)
