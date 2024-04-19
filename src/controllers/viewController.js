import { findSector } from "../services/orderService.js";

export const mainView = async (req, res, next) => {
  const [sectores] = await findSector();

  res.render("index", { sectores });
};
