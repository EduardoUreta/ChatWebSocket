import { Router } from "express";

export const viewsRouter = Router();

// Rutas
viewsRouter.get("/", (req, res) => {
    res.render("home");
});