export class ModalError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'ModalError';
    this.code = code;
  }
}
