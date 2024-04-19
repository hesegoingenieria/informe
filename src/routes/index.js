import express from "express";
import { mainView } from "../controllers/viewController.js";
import { findOrdersInRange } from "../controllers/orderController.js";

export const routerApi = (app) => {
  const router = express.Router();

  app.use("/", router);

  router.get("/", mainView);
  router.get("/order", findOrdersInRange);
};
