import express from "express";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client';
// добавить защиту

export const orderRouter = express.Router();

orderRouter.get('/getLatest',
    async (req, res) => {
        res.send(await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,

        }))
    }

)

orderRouter.get('/get',
    async (req, res) => {
        if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
            return res.status(400).send({error: "id not passed"});
        const user = await prisma.order.findFirst({
            where: {
                id: parseInt(req.query.id) ,
            }
        });
        if (!user) res.status(404);
        res.send(user ?? {error: "order not found"});
    });

orderRouter.post('/create',
    async (req, res) => {
        let order: Prisma.OrderCreateInput
        order = {
            price: req.body.price,
            pickup: req.body.pickup,
            statusOrder: req.body.status,
            user: {
                connect: {
                    id: req.body.authorId
                }
            }


        }
        const newOrder = await prisma.order.create({
            data: order
        })
        res.send(newOrder);
    }

)

orderRouter.get("/getAmount",
    async (req,res) => {
        const userCount = await prisma.order.count()
        res.send({"count": userCount});
    }

)

orderRouter.get("/getUserOrders",
async (req, res) => {
    if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
        return res.status(400).send({error: "id not passed"});
    const orders = await prisma.order.findMany({
        where: {
            userId: parseInt(req.query.id) ,
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 5,
    });
    if (!orders) res.status(404);
    res.send(orders ?? {error: "user not found"});
});

orderRouter.get("/getActive",
    async (req, res) => {
        res.send(await prisma.order.findMany({
         where: {
            statusOrder: "INWORK"
         }
            

    }))
})

orderRouter.post("/update",
async (req,res) => {
    let update: any = {};

    if(req.body.hasOwnProperty("status")) {
        update["statusOrder"] = req.body.status;
    }

    const order = await prisma.order.update({
        where: {
            id: req.body.id,
        },
        data: update
    });
    res.send(order);
}
)