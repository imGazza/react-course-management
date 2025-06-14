export class NotFound404Error extends Error {  
  constructor() {
    super();
    this.name = 'NotFound404Error';
  }
}