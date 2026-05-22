import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import { errorLogger, requestLogger } from './middleware/httpLogger';
import authRoutes from './routes/auth.routes';
import peopleRoutes from './routes/people.routes';
import incidentsRoutes from './routes/incidents.routes';
import criminalRecordsRoutes from './routes/criminalRecords.routes';
import vehiclesRoutes from './routes/vehicles.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Police Database API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/incidents', incidentsRoutes);
app.use('/api/criminal-records', criminalRecordsRoutes);
app.use('/api/vehicles', vehiclesRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorLogger);
app.use(errorHandler);

export default app;
