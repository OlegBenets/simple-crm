describe('User Navigation Test', () => {
  it('should visit the user page and navigate to Jan Michels detail page', () => {
    cy.visit('/user');

    // Simuliere den Klick auf den spezifischen User-Link
    cy.contains('Jan Michel').click();

    // Überprüfe, ob die URL korrekt ist
    cy.url().should('include', '/user/');

    // Überprüfe, ob die Seite die erwarteten Inhalte enthält
    cy.contains('12345 Hamburg').should('be.visible');
  })
})

describe('User Creation and Navigation Test', () => {
  it('should add a new user and navigate to the user\'s detail page', () => {
    cy.visit('/user'); // Visit the user page

    // Click on the "Add User" button
    cy.get('.add-user-button').click(); // Click the button to open the dialog

    // Fill in the user details in the dialog
    cy.get('input[placeholder="First Name"]').type('John'); // Fill in first name
    cy.get('input[placeholder="Last Name"]').type('Doe'); // Fill in last name
    cy.get('input[placeholder="E-Mail"]').type('johndoe@example.com'); // Fill in email
    cy.get('input[placeholder="Birthdate"]').click(); // Fill in birth date (adjust format if needed)
    cy.get('input[placeholder="Placeholder"]').first().type('123 Main St'); // Fill in street
    cy.get('input[placeholder="Placeholder"]').eq(1).type('10001'); // Fill in zip code
    cy.get('input[placeholder="Placeholder"]').last().type('New York'); // Fill in city

    // Submit the form
    cy.contains('Save').click(); // Click the save button

    // Verify that a success message is displayed (adjust as needed)
    cy.contains('Doe').should('be.visible');

    // Now navigate to the user's detail page
    cy.contains('Doe').click(); // Click on the new user's link

    // Verify that the URL is correct and contains the new user's ID
    cy.url().should('include', '/user/'); // Adjust based on your routing

    // Verify that the detail page displays the expected content for the new user
    cy.contains('New York').should('be.visible'); // Adjust based on the expected content
  });
});
