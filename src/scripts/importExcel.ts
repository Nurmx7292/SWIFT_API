import { prisma } from '../database/prisma';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

async function main() {
  const dataDir = path.join(__dirname, '../../data');
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.xlsx'));
  if (files.length === 0) {
    console.error('No Excel (.xlsx) file found in data/ directory.');
    process.exit(1);
  }
  const filePath = path.join(dataDir, files[0]);
  console.log(`Importing from file: ${files[0]}`);

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  for (const row of rows) {
    const swiftCode = String(row['SWIFT CODE']).toUpperCase();
    const bankName = String(row['NAME']).toUpperCase();
    const address = String(row['ADDRESS']);
    const countryISO2 = String(row['COUNTRY ISO2 CODE']).toUpperCase();
    const countryName = String(row['COUNTRY NAME']).toUpperCase();
    const isHeadquarter = swiftCode.endsWith('XXX');

    await prisma.country.upsert({
      where: { iso2Code: countryISO2 },
      update: { name: countryName },
      create: { iso2Code: countryISO2, name: countryName },
    });

    try {
      await prisma.swiftCode.create({
        data: {
          swiftCode,
          bankName,
          address,
          countryIso2: countryISO2,
          isHeadquarter,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        continue;
      } else {
        console.error('Error inserting SWIFT code:', swiftCode, error);
      }
    }
  }
  console.log('Import complete!');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}); 