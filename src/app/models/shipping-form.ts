
export class Shipping {
  name: string;
  addressLine1: string;
  city: string;
  state: string;

  constructor(name?: string, addressLine1?: string, city?:string, state?: string) {
    this.state = state;
    this.name = name;
    this.city = city;
    this.addressLine1 = addressLine1;
  }
}
