describe("index page", () => {
  it("should drag a moon to see the next mooniversary date", () => {
    // Ideally we could assert the actual text of the mooniversary date
    // using a cy.clock command like so:
    //
    // const now = new Date(Date.UTC(2017, 2, 14)).getTime();
    // cy.clock(now);
    //
    // but right now this isn't working
    // but maybe unit tests would be better here

    cy.visit("/");

    cy.getEl("moon-ball").should("be.visible").as("ball");
    cy.getEl("moon-basket").should("be.visible").as("basket");

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

    cy.getEl("next-mooniversary")
      .findEl("next-mooniversary-date")
      .findEl("next-mooniversary-number");
  });

  it("should fail", () => {
    expect(false).to.equal(true);
  });
});
