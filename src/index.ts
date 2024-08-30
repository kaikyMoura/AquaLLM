import express, { Response } from 'express';
import router from './router';

const app = express();
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
    console.log(`Server esta rodando em: http://localhost:${PORT}`);
});

app.get('/', (res: Response) => {
    res.send('Olá, mundo!');
});

app.use(express.json());


app.use(router)