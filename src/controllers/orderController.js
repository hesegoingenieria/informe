import xlsx from "xlsx";
import fs from "fs";
import { find, findByConsumer } from "../services/orderService.js";

export const findOrdersInRange = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sede } = req.query;
    const data = await find(fechaInicio, fechaFin, sede);

    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

export const findOrdersInRangeConsumer = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, sede } = req.query;
    const data = await findByConsumer(fechaInicio, fechaFin, sede);

    res.json(data);
  } catch (err) {
    console.log(err);
  }
};
