import { isHeadquarter, getHeadquarterCode, isBranchAndHeadquarter } from '../src/utils/swiftUtils';

describe('SWIFT code utils', () => {
  it('should identify headquarter codes', () => {
    expect(isHeadquarter('BPKOPLPWXXX')).toBe(true);
    expect(isHeadquarter('BPKOPLPW001')).toBe(false);
  });

  it('should get headquarter code from any SWIFT code', () => {
    expect(getHeadquarterCode('BPKOPLPW001')).toBe('BPKOPLPWXXX');
    expect(getHeadquarterCode('BPKOPLPWXXX')).toBe('BPKOPLPWXXX');
  });

  it('should identify codes that are both branch and headquarter', () => {
    const allCodes = ['BPKOPLPWXXX', 'BPKOPLPW001', 'BPKOPLPW002'];
    expect(isBranchAndHeadquarter('BPKOPLPWXXX', allCodes)).toBe(true);
    expect(isBranchAndHeadquarter('BPKOPLPW001', allCodes)).toBe(false);
    expect(isBranchAndHeadquarter('BPKOPLPWXXX', ['BPKOPLPWXXX'])).toBe(false);
  });
});