describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.login('johndoe@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');
  });

  it('should display correct metrics', () => {
    cy.contains('h2', 'Total value')
      .siblings('span')
      .should('contain', '191184.00 €');
    cy.contains('h2', 'Top selling product')
      .siblings('span')
      .should('contain', 'Lenovo ThinkPad');
    cy.contains('h2', 'All Users').siblings('span').should('contain', '3');

    cy.get('.bar').should('be.visible');
    cy.get('.doughnut').scrollIntoView().should('be.visible');
  });
});

describe('Dashboard Navigation Tests', () => {
  beforeEach(() => {
    cy.login('johndoe@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');
  });

  it('should navigate to Users page', () => {
    cy.contains('User').click();
    cy.visit('/user');
    cy.url().should('include', '/user');
  });

  it('should navigate to Products page', () => {
    cy.contains('Products').click();
    cy.visit('/products');
    cy.url().should('include', '/products');
  });
});
