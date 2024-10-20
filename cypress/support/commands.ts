Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login'); 
    cy.get('input[formControlName="email"]').click({ force: true }).type(email);
    cy.get('input[formControlName="password"]').click({ force: true }).type(password); 
    cy.get('button[type="submit"]').click();
  });