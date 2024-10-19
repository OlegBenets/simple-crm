describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/login')
  })
})

describe('Authentication Tests', () => {
  it('should allow a user to sign up and then log in successfully', () => {

    cy.visit('/login');
    cy.contains('Sign up').click();
    cy.url().should('include', '/signup');

    cy.get('input[formControlName="firstName"]').click({ force: true }).type('John'); 
    cy.get('input[formControlName="lastName"]').click({ force: true }).type('Doe'); 
    cy.get('input[formControlName="email"]').click({ force: true }).type('johndoe@example.com'); 
    cy.get('input[formControlName="password"]').click({ force: true }).type('Password123!'); 

    cy.get('button[type="submit"]').click(); 
    cy.url().should('include', '/login');

    cy.login('johndoe@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');

    cy.contains('All Users').should('be.visible');
  });
});
