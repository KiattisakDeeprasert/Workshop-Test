import { Router } from "express";
import task_routes from "./task_routes";

const apiRouter = Router();

apiRouter.use("/tasks", task_routes);

export default apiRouter;
