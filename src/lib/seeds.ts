export class Person {
  static nextId = 1;
  public readonly id: number;
  public addresses: Address[]

  constructor(public firstName: string, public lastName: string, addresses: Address[] = []) {
    this.id = Person.nextId++;
    this.addresses = addresses || [];
  }

  public fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  public addressCount() {
    return this.addresses.length;
  }
}

export class Address {
  static nextId = 1;
  public readonly id: number;

  constructor(public street: string, public city: string, public stateCode: string, public zipCode: string) {
    this.id = Address.nextId++;
  }

  public fullAddress() {
    return `${this.street}, ${this.city}, ${this.stateCode} ${this.zipCode}`;
  }
}

export const seeds = [
  new Person(
    "Dawna",
    "Keeling",
    [
      new Address("11769 Ariane Ridge", "Port Rolando", "CO", "80027"),
      new Address("79976 Abernathy Parkway", "East Joanfort", "NM", "88097"),
    ],
  ),
  new Person(
    "Melaine",
    "Bosco",
    [
      new Address("503 Yost Circle", "New Rogerberg", "IL", "60069"),
    ],
  ),
  new Person(
    "Fawn",
    "Torp",
    [
      new Address("8308 Howell Glens", "Lake Britt", "HI", "96774"),
    ],
  ),
  new Person(
    "Darin",
    "Cruickshank",
    [
      new Address("54774 Lang View", "Lake Bufordmouth", "FL", "32250"),
      new Address("9231 Darnell Station", "East Azaleebury", "IL", "60016"),
    ],
  ),
  new Person(
    "Carrol",
    "Baumbach",
    [
      new Address("612 Hoppe Isle", "Estebanbury", "WI", "54919"),
    ],
  ),
];
