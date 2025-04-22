import { Request, Response } from 'express';
import { prisma } from '../database/prisma';

export const getSwiftCode = async (req: Request, res: Response):Promise<any> => {
  const { swiftCode } = req.params;

  try {
    const swift = await prisma.swiftCode.findUnique({
      where: { swiftCode },
      include: { country: true },
    });

    if (!swift) {
      return res.status(404).json({ message: 'SWIFT code not found' });
    }

    if (swift.isHeadquarter) {
      const branches = await prisma.swiftCode.findMany({
        where: {
          countryIso2: swift.countryIso2,
          isHeadquarter: false,
          swiftCode: { startsWith: swift.swiftCode.slice(0, 8) },
        },
      });
      return res.json({
        address: swift.address,
        bankName: swift.bankName,
        countryISO2: swift.countryIso2,
        countryName: swift.country.name,
        isHeadquarter: true,
        swiftCode: swift.swiftCode,
        branches: branches.map((b: typeof branches[0]) => ({
          address: b.address,
          bankName: b.bankName,
          countryISO2: b.countryIso2,
          isHeadquarter: false,
          swiftCode: b.swiftCode,
        })),
      });
    } else {
      return res.json({
        address: swift.address,
        bankName: swift.bankName,
        countryISO2: swift.countryIso2,
        countryName: swift.country.name,
        isHeadquarter: false,
        swiftCode: swift.swiftCode,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSwiftCodesByCountry = async (req: Request, res: Response): Promise<any> => {
    const { countryISO2code } = req.params;
  
    try {
      const country = await prisma.country.findUnique({
        where: { iso2Code: countryISO2code.toUpperCase() },
        include: { swiftCodes: true },
      });
  
      if (!country) {
        return res.status(404).json({ message: 'Country not found' });
      }
  
      return res.json({
        countryISO2: country.iso2Code,
        countryName: country.name,
        swiftCodes: country.swiftCodes.map((code: typeof country.swiftCodes[0]) => ({
          address: code.address,
          bankName: code.bankName,
          countryISO2: code.countryIso2,
          isHeadquarter: code.isHeadquarter,
          swiftCode: code.swiftCode,
        })),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  export const createSwiftCode = async (req: Request, res: Response): Promise<any> => {
    req.body.isHeadquarter = req.body.isHeadquarter === true || req.body.isHeadquarter === 'true';
    const { address, bankName, countryISO2, countryName, isHeadquarter, swiftCode } = req.body;
    
    // Check if all required fields are provided
    if (!address || !bankName || !countryISO2 || !countryName || typeof isHeadquarter !== 'boolean' || !swiftCode) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      await prisma.country.upsert({
        where: { iso2Code: countryISO2.toUpperCase() },
        update: { name: countryName.toUpperCase() },
        create: {
          iso2Code: countryISO2.toUpperCase(),
          name: countryName.toUpperCase(),
        },
      });
      await prisma.swiftCode.create({
        data: {
          address,
          bankName,
          countryIso2: countryISO2.toUpperCase(),
          isHeadquarter,
          swiftCode,
        },
      });
  
      return res.status(201).json({ message: 'SWIFT code created successfully' });
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'SWIFT code already exists' });
      }
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const deleteSwiftCode = async (req: Request, res: Response): Promise<any> => {
  const { swiftCode } = req.params;

  try {
    await prisma.swiftCode.delete({
      where: { swiftCode },
    });
    return res.json({ message: 'SWIFT code deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'SWIFT code not found' });
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};