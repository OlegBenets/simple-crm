describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/login')
  })
})

describe('Authentication Tests', () => {
  it('should signup and login', () => {

    cy.visit('/login');
    cy.contains('Sign up').click();
    cy.url().should('include', '/signup');

    cy.get('input[formControlName="firstName"]').click({ force: true }).type('John'); 
    cy.get('input[formControlName="lastName"]').click({ force: true }).type('Doe'); 
    cy.get('input[formControlName="email"]').click({ force: true }).type('johndoe@example.com'); 
    cy.get('input[formControlName="password"]').click({ force: true }).type('Password123!'); 

    cy.get('button[type="submit"]').click(); 
    cy.url().should('include', '/login');

    cy.get('input[formControlName="email"]').should('be.visible').click().type('johndoe@example.com'); 
    cy.get('input[formControlName="password"]').should('be.visible').click().type('Password123!');
   
    cy.get('button[type="submit"]').click(); 
    cy.url().should('include', '/dashboard');

    cy.contains('All Users').should('be.visible');
  });
});
