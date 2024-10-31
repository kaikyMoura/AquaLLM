import express from 'express';
import logger from 'morgan';
import path from 'path';
import router from './routes/appRoutes';

const app = express();

app.use(logger('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(router)

export default app;