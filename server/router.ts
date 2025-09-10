import express, { Router } from "express";
import AuthRouter from "./routers/AuthRouter";
import ProfileRouter from "./routers/ProfileRouter";
import BreedRouter from "./routers/BreedRouter";
import AnimalTypeRouter from "./routers/AnimalTypeRouter";
import AnimalRouter from "./routers/AnimalRouter";
import CodeRouter from "./routers/CodeRouter";
const router: Router = express.Router();

router.get("/ping", (req, res) => {
	// #swagger.tags = ["System", "NotSecured"]
	req.logger.info("Test");
	req.logger.error("Test");
	req.logger.debbug("Test");

	res.json({ message: "pong!" }).status(200);
});

router.use("/user", AuthRouter);
router.use("/profile", ProfileRouter);
router.use("/breed", BreedRouter);
router.use("/animaltype", AnimalTypeRouter);
router.use("/animal", AnimalRouter);
router.use("/code", CodeRouter);

export { router };
