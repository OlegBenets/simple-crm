describe('User Tests', () => {
  beforeEach(() => {
    cy.login('johndoe@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');
    cy.contains('User').click();
    cy.visit('/user');
    cy.url().should('include', '/user');
  });

  it('should navigate to User page and add new user', () => {
    cy.get('.add-user-button').click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[placeholder="First Name"]')
      .click({ force: true })
      .type('John');
    cy.get('input[placeholder="Last Name"]').click({ force: true }).type('Doe');
    cy.get('input[placeholder="E-Mail"]')
      .click({ force: true })
      .type('johndoe@example.com');
    cy.get('input[placeholder="Birthdate"]')
      .click({ force: true })
      .type('02.03.2001');
    cy.get('input[placeholder="Street + House No."]')
      .click({ force: true })
      .type('Main Str 1');
    cy.get('input[placeholder="Zip Code"]')
      .click({ force: true })
      .type('10001');
    cy.get('input[placeholder="City"]').click({ force: true }).type('New York');

    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains('John Doe').should('be.visible');
  });

  it('should click on new user and edit', () => {
    cy.contains('John Doe').should('be.visible').click();

    cy.get('.menu-button-header').click();
    cy.get('.edit-user-btn').contains('Edit').click();

    cy.get('input[placeholder="First Name"]')
      .click({ force: true })
      .clear()
      .type('Joel');
    cy.get('input[placeholder="Last Name"]')
      .click({ force: true })
      .clear()
      .type('Miller');
    cy.get('input[placeholder="E-Mail"]')
      .click({ force: true })
      .clear()
      .type('miller@example.com');
    cy.get('input[placeholder="Birthdate"]')
      .click({ force: true })
      .clear()
      .type('02.03.1990');

    cy.get('button[type="submit"]').click();

    cy.contains('Joel Miller').should('be.visible');
    cy.contains('miller@example.com').should('be.visible');
  });

  it('should click on new user and edit address', () => {
    cy.contains('Joel Miller').should('be.visible').click();

    cy.get('.menu-button').click();
    cy.get('.edit-address-btn').contains('Edit').click();

    cy.get('input[placeholder="Street + House No."]')
      .click({ force: true })
      .clear()
      .type('Main Str 3');
    cy.get('input[placeholder="Zip Code"]')
      .click({ force: true })
      .clear()
      .type('11111');
    cy.get('input[placeholder="City"]')
      .click({ force: true })
      .clear()
      .type('New Jersey');

    cy.get('button[type="submit"]').click();

    cy.contains('Main Str 3').should('be.visible');
    cy.contains('New Jersey').should('be.visible');
  });

  it('should delete new user', () => {
    cy.contains('New Jersey').should('be.visible').click();

    cy.get('.menu-button-header').click();
    cy.get('.delete-user-btn').contains('Delete User').click();
    cy.contains('Joel Miller').should('not.exist');
  });
});
