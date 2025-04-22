import express from 'express';
import swiftCodeRoutes from './routes/swiftCodeRoutes';
const app = express();

app.use(express.json());


app.use(swiftCodeRoutes);
app.get('/', (_, res) => {
  res.send('SWIFT Codes API');
});

export default app; 