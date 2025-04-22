// true if code is a headquarter (ends with 'XXX')
export function isHeadquarter(swiftCode: string): boolean {
    return swiftCode.endsWith('XXX');
  }
  
  // get headquarter code for any SWIFT (first 8 + 'XXX')
  export function getHeadquarterCode(swiftCode: string): string {
    return swiftCode.slice(0, 8) + 'XXX';
  }
  
  // true if code is both HQ and has branches with same prefix
  export function isBranchAndHeadquarter(swiftCode: string, allCodes: string[]): boolean {
    if (!isHeadquarter(swiftCode)) return false;
    const prefix = swiftCode.slice(0, 8);
    return allCodes.some(code => code.startsWith(prefix) && code !== swiftCode);
  }