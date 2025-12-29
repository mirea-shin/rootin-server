import express from 'express';

// route
import authRoute from './routes/auth';
import routinesRoute from './routes/routines';
import taskRoute from './routes/task';
import taskLogRoute from './routes/taskLog';

const app = express();

app.use('/auth', authRoute);
app.use('/routines', routinesRoute);
app.use('/tasks', taskRoute);
app.use('/task-logs', taskLogRoute);

app.listen(3000, () => {
  console.log('server connected');
});
