import { Router } from 'express';
import { getSwiftCode, getSwiftCodesByCountry, createSwiftCode, deleteSwiftCode } from '../controllers/swiftCodeController';

const router = Router();

// GET /v1/swift-codes/:swiftCode
router.get('/v1/swift-codes/:swiftCode', getSwiftCode);

// GET /v1/swift-codes/country/:countryISO2code
router.get('/v1/swift-codes/country/:countryISO2code', getSwiftCodesByCountry);

router.post('/v1/swift-codes', createSwiftCode);

router.delete('/v1/swift-codes/:swiftCode', deleteSwiftCode);

export default router;
