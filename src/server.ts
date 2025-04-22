import 'dotenv/config';
import app from './app';
import { prisma } from './database/prisma';

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function testDb() {
  const countries = await prisma.country.findMany();
  console.log('Countries:', countries);
}
testDb(); 