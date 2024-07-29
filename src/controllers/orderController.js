import { find, findByConsumer } from "../services/orderService.js";

export const findOrdersInRange = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin, sector } = req.body;
    const data = await find(fechaInicio, fechaFin, sector);

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const findOrdersInRangeConsumer = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin, sector } = req.body;
    const data = await findByConsumer(fechaInicio, fechaFin, sector);

    res.json(data);
  } catch (err) {
    next(err);
  }
};
