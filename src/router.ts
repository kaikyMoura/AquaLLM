import { MeasureController } from "./controllers/MeasureController";
import { Router } from 'express';

const router = Router()

const controller = new MeasureController();

router.post('/upload', controller.uploadImage);
router.patch('/confirm', controller.confirmValue);
router.get('/:customer_code/list', controller.listMeasures);

export default router;