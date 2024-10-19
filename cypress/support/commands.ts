Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login'); 
    cy.get('input[formControlName="email"]').type(email);
    cy.get('input[formControlName="password"]').type(password); 
    cy.get('button[type="submit"]').click();
  });