import express from "express";
import prisma from "./db";
import {User, PrismaClient, Prisma} from '@prisma/client';
import { YooCheckout, ICreatePayment  } from '@a2seven/yoo-checkout';
import { v4 as uuidv4 } from 'uuid';


const checkout = new YooCheckout({ shopId: '298896', secretKey: 'test_kV50VmccKgh4UXXNbe1LhhdCSgu7Zrx91cnnYcKkHZA' });

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

orderRouter.get('/getUserOrders',
    async (req, res) => {
        if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
            return res.status(400).send({error: "id not passed"});
        const user = await prisma.order.findMany({
            where: {
                userId: parseInt(req.query.id) ,
            }
        });
        if (!user) res.status(404);
        res.send(user ?? {error: "order not found"});
    });

orderRouter.post('/createPayment',
    async (req,res) => {
        const idempotenceKey = uuidv4();
        const createPayload: ICreatePayment = {
            amount: {
                value: req.body.price,
                currency: 'RUB'
            },
            confirmation: {
                type: 'redirect',
                return_url: req.body.url,
            },
            "capture": true,
            "description" : `Заказ # ${req.body.orderId}`
        };
        
        try {
            const payment = await checkout.createPayment(createPayload, idempotenceKey);
            console.log(payment);
            console.log(payment.confirmation.confirmation_url);
            const aboba = {
                "url": payment.confirmation.confirmation_url
            }
            res.send(aboba);
        } catch (error) {
             console.error(error);
        }
    }
)

orderRouter.get('/paymentStatus',
    async(req,res) => {
        if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id)))
            return res.status(400).send({error: "id not passed"});
        try {
                const payment = await checkout.getPayment(req.query.id);
                console.log(payment)
            } catch (error) {
                 console.error(error);
            }
            
    }
)

orderRouter.get('/status',
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
            sostav: req.body.sostav,
            user: {
                connect: {
                    telegramId: req.body.authorId
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
        }
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