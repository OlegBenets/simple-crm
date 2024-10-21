describe('Product Tests', () => {
  beforeEach(() => {
    cy.login('johndoe@example.com', 'Password123!');
    cy.url().should('include', '/dashboard');
    cy.contains('Products').click();
    cy.visit('/products');
    cy.url().should('include', '/products');
  });

  it('should navigate to Products page and add new product', () => {
    cy.get('.add-product-button').click();
    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[placeholder="Product Name"]').click().type('MacBook Air M2');
    cy.get('input[placeholder="Price"]').click().type('2000');
    cy.get('textarea[placeholder="Description"]')
      .click()
      .type('Test test test');
    cy.get('input[placeholder="Add Detail"]').click().type('Apple M2 Chip');

    cy.get('button[type="button"]').contains('Add').click();
    cy.contains('Apple M2 Chip').should('be.visible');

    cy.get('button[type="submit"]').click();
    cy.wait(3000);
    cy.contains('MacBook Air M2').should('be.visible');
  });

  it('should click on new product and edit', () => {
    cy.contains('MacBook Air M2').should('be.visible').click();

    cy.get('.menu-button-header').click();
    cy.get('.edit-product-btn').contains('Edit').click();

    cy.get('mat-dialog-container').should('be.visible');

    cy.get('input[placeholder="Product Name"]').clear().type('MacBook Air M3');
    cy.get('input[placeholder="Price"]').clear().type('2100');

    cy.get('button[type="submit"]').click();

    cy.contains('MacBook Air M3').should('be.visible');
    cy.contains('2100').should('be.visible');
  });

  it('should click on description and edit', () => {
    cy.contains('MacBook Air M3').should('be.visible').click();

    cy.get('.menu-button').click();
    cy.get('.edit-description-btn').contains('Edit').click();

    cy.get('mat-dialog-container').should('be.visible');

    cy.get('textarea[placeholder="Description"]')
      .clear()
      .type('Updated description');

    cy.get('input[placeholder="Add Detail"]').click().type('Apple M1 Pro Chip');
    cy.get('button[type="button"]').contains('Add').click();
    cy.contains('Apple M1 Pro Chip').should('be.visible');

    cy.get('input[placeholder="Add Detail"]').click().type('Apple M1 Chip');
    cy.get('button[type="button"]').contains('Add').click();
    cy.contains('Apple M1 Chip').should('be.visible');

    cy.get('.detail-list')
      .contains('Apple M1 Chip')
      .siblings()
      .find('mat-icon')
      .contains('delete')
      .click();
    cy.contains('Apple M1 Chip').should('not.exist');

    cy.get('.detail-list')
      .contains('Apple M1 Pro Chip')
      .siblings()
      .find('mat-icon')
      .contains('edit')
      .click();
    cy.get('input.edit-detail-input').clear().type('Apple M3 Chip');
    cy.get('mat-icon').contains('check').click();

    cy.contains('Apple M3 Chip').should('be.visible');

    cy.get('button[type="submit"]').click();
    cy.contains('MacBook Air M3').should('be.visible');
  });

  it('should delete new product', () => {
    cy.contains('MacBook Air M3').should('be.visible').click();

    cy.get('.menu-button-header').click();
    cy.get('.delete-product-btn').contains('Delete Product').click();
    cy.contains('MacBook Air M3').should('not.exist');
  });
});
