/**
 * Represents an admin user in the application.
 * This class provides a structure for storing admin data and methods for data manipulation.
 */
export class Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;

  /**
   * Constructs an instance of the Admin class.
   *
   * @param obj Optional parameter to initialize the admin properties.
   *             If provided, it should contain properties matching the Admin class.
   */
  constructor(obj?: any) {
    this.id = obj ? obj.id : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.email = obj ? obj.email : '';
    this.password = obj ? obj.password : '';
  }

  /**
   * Converts the Admin instance to a plain JavaScript object.
   * This method is useful for serializing the object for storage or transmission.
   *
   * @returns A plain object representation of the Admin instance.
   */
  public toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };
  }
}
