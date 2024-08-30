import express, { Request, Response } from 'express';
import { MeasureController } from './controllers/MeasureController';
const app = express();
const PORT = process.env.PORT || 3000;

const controller = new MeasureController()

app.listen(PORT, () => {
    console.log(`Server esta rodando em: http://localhost:${PORT}`);
});


app.use(express.json());

app.post('/upload', controller.uploadImage);
app.patch('/confirm', controller.confirmValue);
app.get('/:customer_code/list', controller.listMeasures);

