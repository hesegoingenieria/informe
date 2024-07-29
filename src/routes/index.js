import express from "express";
import multer from "multer";
import { mainView } from "../controllers/viewController.js";
import {
  findOrdersInRange,
  findOrdersInRangeConsumer,
} from "../controllers/orderController.js";

const upload = multer();

export const routerApi = (app) => {
  const router = express.Router();

  app.use("/", router);

  // Vistas
  router.get("/", mainView);

  // API
  router.post("/order", upload.none(), findOrdersInRange);
  router.post("/order/consumer", upload.none(), findOrdersInRangeConsumer);
};
