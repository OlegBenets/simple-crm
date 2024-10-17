describe('User Navigation Test', () => {
  it('should visit the user page and navigate to Oleg Benets detail page', () => {
    cy.visit('/user');

    cy.contains('Oleg Benets').click();

    cy.url().should('include', '/user/');

    cy.contains('95326 Kulmbach').should('be.visible');
  })
})

describe('User Creation and Navigation Test', () => {
  it('should add a new user and navigate to the user\'s detail page', () => {
    cy.visit('/user'); 

    cy.get('.add-user-button').click(); 

    cy.get('input[placeholder="First Name"]').type('John'); 
    cy.get('input[placeholder="Last Name"]').type('Doe');
    cy.get('input[placeholder="E-Mail"]').type('johndoe@example.com'); 
    cy.get('input[placeholder="Birthdate"]').type('02.03.2001'); 
    cy.get('input[placeholder="Placeholder"]').first().type('123 Main St'); 
    cy.get('input[placeholder="Placeholder"]').eq(1).type('10001'); 
    cy.get('input[placeholder="Placeholder"]').last().type('New York');

    cy.contains('Save').click();

    cy.contains('Doe').should('be.visible');

    cy.contains('Doe').click();

    cy.url().should('include', '/user/');

    cy.contains('New York').should('be.visible'); 
  });
});