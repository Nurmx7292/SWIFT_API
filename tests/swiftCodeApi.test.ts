import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database/prisma';

// Prepare test data before running tests
beforeAll(async () => {
  console.log('Seeding test data...');
  await prisma.country.upsert({
    where: { iso2Code: 'PL' },
    update: { name: 'POLAND' },
    create: { iso2Code: 'PL', name: 'POLAND' },
  });

  await prisma.swiftCode.create({
    data: {
      swiftCode: 'BPKOPLPWXXX',
      bankName: 'PKO BANK POLSKI',
      address: 'UL. PUŁAWSKA 15, 02-515 WARSZAWA',
      isHeadquarter: true,
      countryIso2: 'PL',
    },
  });
  console.log('Test data seeded');
});

// Clean up test data after all tests
afterAll(async () => {
  console.log('Cleaning up test data...');
  await prisma.swiftCode.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.$disconnect();
  console.log('Test data cleanup complete');
});

describe('SWIFT Codes API', () => {
  it('should return 404 for non-existent SWIFT code', async () => {
    console.log('Testing 404 for non-existent SWIFT code...');
    const res = await request(app).get('/v1/swift-codes/NOTEXIST123');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'SWIFT code not found');
    console.log('404 test passed');
  });

  it('should return SWIFT code details for existing code', async () => {
    console.log('Testing details for existing SWIFT code...');
    const res = await request(app).get('/v1/swift-codes/BPKOPLPWXXX');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('swiftCode', 'BPKOPLPWXXX');
    expect(res.body).toHaveProperty('isHeadquarter', true);
    expect(res.body).toHaveProperty('branches');
    console.log('Details test passed');
  });

  it('should return all SWIFT codes for a given country', async () => {
    console.log('Testing GET /v1/swift-codes/country/:countryISO2code...');
    const res = await request(app).get('/v1/swift-codes/country/PL');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('countryISO2', 'PL');
    expect(res.body).toHaveProperty('countryName', 'POLAND');
    expect(res.body).toHaveProperty('swiftCodes');
    expect(Array.isArray(res.body.swiftCodes)).toBe(true);
    expect(res.body.swiftCodes.length).toBeGreaterThan(0);
    expect(res.body.swiftCodes[0]).toHaveProperty('swiftCode', 'BPKOPLPWXXX');
    console.log('Country codes test passed');
  });

  it('should create a new SWIFT code', async () => {
    console.log('Testing POST /v1/swift-codes...');
    const res = await request(app)
      .post('/v1/swift-codes')
      .send({
        address: 'UL. BRANCH 1, 00-000 WARSZAWA',
        bankName: 'PKO BANK POLSKI',
        countryISO2: 'PL',
        countryName: 'POLAND',
        isHeadquarter: false,
        swiftCode: 'BPKOPLPW001'
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'SWIFT code created successfully');
    console.log('POST test passed');
  });

  it('should delete a SWIFT code', async () => {
    console.log('Testing DELETE /v1/swift-codes/:swiftCode...');
    const res = await request(app).delete('/v1/swift-codes/BPKOPLPW001');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'SWIFT code deleted successfully');
    console.log('DELETE test passed');
  });
});