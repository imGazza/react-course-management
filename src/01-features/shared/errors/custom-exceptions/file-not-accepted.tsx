export class FileNotAcceptedError extends Error {  
  constructor() {
    super();
    this.name = 'FileNotAcceptedError';
  }
}