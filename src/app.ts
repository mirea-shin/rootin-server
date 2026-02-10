import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// route
import authRoute from './routes/auth';
import routinesRoute from './routes/routines';
import tasksRoute from './routes/tasks';
import taskLogRoute from './routes/taskLog';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoute);
app.use('/routines', routinesRoute);
app.use('/tasks', tasksRoute);
app.use('/task-logs', taskLogRoute);

app.listen(3000, () => {
  console.log('server connected');
});
