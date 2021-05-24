import * as express from 'express';
import { MetricsController } from '../api/MetricsController';
import { AppConfig } from './AppConfig';
import * as path from 'path';

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.post('/metrics/', MetricsController.postMetrics);
app.put('/metrics/', MetricsController.updateMetrics);

app.set('port', AppConfig.port());

app.use('/', express.static(path.join(__dirname, '../resources')));

export default app;
