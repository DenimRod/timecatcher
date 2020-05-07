export class Message {
  constructor(type, text) {
    this.type = type;
    this.text = text;
  }
    //0 - Error, 1 - Warning
  type: number;
  text: string;
}
