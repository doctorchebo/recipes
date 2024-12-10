export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _expiresAt: Date
  ) {}

  get token() {
    if (!this._token || new Date() > this._expiresAt) {
      return null;
    }
    return this._token;
  }
}
