import { Router } from 'express';
import measureController from '../controllers/MeasureController';

const router = Router()

router.post('/upload', measureController.uploadImage);
router.delete('/delete/:customer_code', measureController.deleteMeasure);
router.patch('/confirm', measureController.confirmValue);
router.get('/:customer_code/list', measureController.listMeasures);

export default router;