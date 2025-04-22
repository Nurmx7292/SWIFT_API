import { Router } from 'express';
import { getSwiftCode, getSwiftCodesByCountry, createSwiftCode, deleteSwiftCode } from '../controllers/swiftCodeController';

const router = Router();

router.get('/v1/swift-codes/:swiftCode', getSwiftCode);

router.get('/v1/swift-codes/country/:countryISO2code', getSwiftCodesByCountry);

router.post('/v1/swift-codes', createSwiftCode);

router.delete('/v1/swift-codes/:swiftCode', deleteSwiftCode);

export default router;
