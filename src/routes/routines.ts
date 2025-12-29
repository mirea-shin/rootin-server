import express from 'express';

const routinesRoute = express().router;

routinesRoute.get('/', async (req, res) => {});
routinesRoute.get('/test', async (req, res) => {});

export default routinesRoute;
