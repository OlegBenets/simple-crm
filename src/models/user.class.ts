/**
 * Represents a user in the application.
 */
export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  street: string;
  zipCode: string;
  city: string;

  /**
   * Creates an instance of the User class.
   *
   * @param obj Optional object to initialize the user properties.
   */
  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
    this.birthDate = obj ? new Date(obj.birthDate) : new Date();
    this.street = obj ? obj.street : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }

  /**
   * Converts the user instance to a JSON-compatible object.
   *
   * @returns An object representation of the user instance, suitable for serialization.
   */
  public toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      birthDate: this.birthDate,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
    };
  }
}
