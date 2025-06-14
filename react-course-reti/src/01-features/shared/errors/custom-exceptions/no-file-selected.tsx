export class NoFileSelectedError extends Error {  
  constructor() {
    super();
    this.name = 'NoFileSelectedError';
  }
}