
import express from 'express';
import {handleWebhookEvent } from '../controllers/CTPNController.js';

const router = express.Router();

router.post('/connect', handleWebhookEvent);

export { router as ConnectRouter };
