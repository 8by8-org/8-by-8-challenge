export class VoterRegistrationPathNames {
  private static readonly pathNames = new Map([
    ['ELIGIBILITY', '/register/eligibility'],
    ['NAMES', '/register/names'],
    ['ADDRESSES', '/register/addresses'],
    ['OTHER_INFO', '/register/otherinfo'],
  ]);

  public static get ELIGIBILITY() {
    return this.pathNames.get('ELIGIBILITY');
  }

  public static get NAMES() {
    return this.pathNames.get('NAMES');
  }

  public static get ADDRESSES() {
    return this.pathNames.get('ADDRESSES');
  }

  public static get OTHER_INFO() {
    return this.pathNames.get('OTHER_INFO');
  }

  public static getPathIndex(path: string) {
    return Array.from(this.pathNames.values()).indexOf(path);
  }
}
