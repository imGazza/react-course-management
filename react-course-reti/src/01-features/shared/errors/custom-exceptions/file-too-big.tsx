export class FileTooBigError extends Error {  
  constructor() {
    super();
    this.name = 'FileTooBigError';
  }
}