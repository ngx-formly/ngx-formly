/// <reference types="cypress" />

describe('HTML labels and descriptions', () => {
  ['bootstrap', 'material', 'ionic', 'kendo', 'primeng', 'antd'].forEach((ui) => {
    it(`renders and updates ${ui} labels and descriptions`, () => {
      if (ui !== 'ionic') {
        cy.request(`/${ui}`)
          .its('body')
          .should('contain', 'class="html-label"')
          .and('contain', 'class="html-description"');
      }
      cy.visit(`/${ui}`);
      cy.contains('Form ready');
      cy.get('formly-app-ui [ngh]').should('not.exist');
      cy.get('formly-field.field-input .html-label').should('be.visible').and('have.text', 'input label');
      cy.get('formly-field.field-input .html-description').should('be.visible').and('have.text', 'input description');
      cy.get('[data-test="toggle-html"]').click();
      cy.get('[data-test="toggle-html"]').should('have.attr', 'aria-pressed', 'false');
      cy.get('.html-label, .html-description').should('not.exist');
      if (ui === 'ionic') {
        cy.get('formly-field.field-input ion-input').should(
          'have.prop',
          'label',
          '<strong class="html-label">input label</strong>',
        );
      } else {
        cy.get('formly-field.field-input').should('contain.text', '<strong class="html-label">input label</strong>');
      }
      cy.get('[data-test="toggle-html"]').click();
      cy.get('formly-field.field-input .html-label').should('be.visible');
      cy.get('formly-field.field-input .html-description').should('be.visible');
    });

    it(`keeps ${ui} checkbox links independent of the control`, () => {
      cy.visit(`/${ui}`);
      cy.contains('Form ready');
      cy.get('formly-app-ui [ngh]').should('not.exist');
      cy.get('formly-field.field-checkbox a strong').click();
      cy.location('hash').should('eq', '#terms');
      if (ui === 'ionic') {
        cy.get('formly-field.field-checkbox ion-checkbox').should('have.attr', 'aria-checked', 'false');
        cy.get('formly-field.field-checkbox ion-checkbox').click('topLeft').should('have.attr', 'aria-checked', 'true');
      } else {
        cy.get('formly-field.field-checkbox input[type="checkbox"]')
          .should('have.length', 1)
          .should('not.be.checked')
          .click({ force: true })
          .should('be.checked');
      }
    });
  });

  it('keeps Ionic toggle, select, and datetime links independent of the controls', () => {
    cy.visit('/ionic');
    cy.contains('Form ready');
    ['toggle', 'select', 'datetime'].forEach((type) => {
      cy.get(`formly-field.field-${type} a strong`).click();
      cy.location('hash').should('eq', '#terms');
    });
    cy.get('ion-toggle').should('have.attr', 'aria-checked', 'false');
    cy.get('ion-alert, ion-action-sheet, ion-popover').should('not.exist');
    cy.get('ion-modal').should('have.prop', 'isOpen', false);
  });
});
