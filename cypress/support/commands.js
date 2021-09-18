// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("getEl", (selector, ...args) => {
  cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add(
  "findEl",
  { prevSubject: "element" },
  (subject, selector, ...args) => {
    cy.wrap(subject).get(`[data-test=${selector}]`, ...args);
  }
);

Cypress.Commands.add("dragMoon", () => {
  cy.getEl("moon-ball").should("be.visible").as("ball");
  cy.getEl("moon-basket").should("be.visible").as("basket");

  // Drag and drop moon
  cy.get("@ball").then(($ball) => {
    cy.get("@basket").then(($basket) => {
      const basket = $basket[0].getBoundingClientRect();
      const offset = $ball.width() / 2;
      cy.wrap($ball)
        .trigger("mousedown", { button: 0 })
        .trigger("mousemove", {
          clientX: basket.x + offset,
          clientY: basket.y + offset,
        })
        // For some reason, we need at least two mouse move events
        // in order to trigger the screen correctly
        // no idea why this could be a problem for future dan
        .trigger("mousemove", {
          clientX: basket.x + offset,
          clientY: basket.y + offset,
        });
    });
  });
});

Cypress.Commands.add("checkMooniversary", ({ dateText, numberText }) => {
  cy.getEl("next-mooniversary")
    .findEl("next-mooniversary-date")
    .should("contain.text", dateText)
    .findEl("next-mooniversary-number")
    .should("contain.text", numberText);
});

Cypress.Commands.add("updateMooniversary", (inputString) => {
  cy.getEl("edit-text-label").click();
  cy.getEl("edit-text-input").clear().type(inputString);
});
