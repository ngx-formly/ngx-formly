/// <reference types="cypress" />

describe('Server side rendering', () => {
  ['material', 'bootstrap', 'kendo', 'optimus-ui', 'primeng', 'antd'].forEach((ui) => {
    it(`should hydrate ${ui} inputs`, () => {
      cy.request(`/${ui}`).its('body').should('contain', 'Form ready');
      cy.visit(`/${ui}`);
      cy.window().should('not.have.property', 'Zone');
      cy.get('formly-app-ui [ngh]').should('not.exist');
      cy.get('input[placeholder="input placeholder"]')
        .should('be.enabled')
        .type('Angular 22')
        .should('have.value', 'Angular 22')
        .and('have.class', 'ng-dirty');
    });
  });

  it('should render material ui', () => {
    cy.request('/material')
      .its('body')
      .should('contain', 'input label')
      .and('contain', 'textarea label')
      .and('contain', 'radio label')
      .and('contain', 'checkbox label')
      .and('contain', 'multicheckbox label')
      .and('contain', 'select label')
      .and('contain', 'toggle label')
      .and('contain', 'native-select label')
      .and('contain', 'slider label')
      .and('contain', 'datepicker label');
  });

  it('should render bootstrap ui', () => {
    cy.request('/bootstrap')
      .its('body')
      .should('contain', 'input label')
      .and('contain', 'textarea label')
      .and('contain', 'radio label')
      .and('contain', 'checkbox label')
      .and('contain', 'multicheckbox label')
      .and('contain', 'select label');
  });

  it('should render kendo ui', () => {
    cy.request('/kendo')
      .its('body')
      .should('contain', 'input label')
      .and('contain', 'textarea label')
      .and('contain', 'radio label')
      .and('contain', 'checkbox label')
      .and('contain', 'select label');
  });

  it('should render primeng ui', () => {
    cy.request('/primeng')
      .its('body')
      .should('contain', 'input label')
      .and('contain', 'textarea label')
      .and('contain', 'radio label')
      .and('contain', 'checkbox label')
      .and('contain', 'select label');
  });

  it('renders Optimus UI fields and the opt-in datepicker', () => {
    cy.request('/optimus-ui')
      .its('body')
      .then((html) => {
        const page = new DOMParser().parseFromString(html, 'text/html');
        for (const selector of [
          'input[pInputText]',
          'textarea[pTextarea]',
          'p-radiobutton',
          'p-checkbox',
          'p-select',
          'p-datepicker input',
        ]) {
          expect(page.querySelector(selector) !== null, selector).to.equal(true);
        }
      });
  });

  it('spaces Optimus UI options, labels, and descriptions without PrimeFlex', () => {
    cy.visit('/optimus-ui');
    cy.get('.field-radio p-radiobutton').should(($options) => {
      const first = $options[0].getBoundingClientRect();
      const second = $options[1].getBoundingClientRect();
      const label = $options.closest('formly-field').find('.field > label')[0].getBoundingClientRect();
      expect(first.top, 'first option below the group label').to.be.greaterThan(label.bottom);
      expect(second.top, 'space between options').to.be.greaterThan(first.bottom);
    });
    cy.get('.field-checkbox p-checkbox')
      .first()
      .should(($checkbox) => {
        const description = $checkbox.closest('formly-field').find('small')[0].getBoundingClientRect();
        expect(description.top, 'space before the description').to.be.greaterThan(
          $checkbox[0].getBoundingClientRect().bottom,
        );
      });
  });

  it('should render ng-zorro-antd', () => {
    cy.request('/antd')
      .its('body')
      .should('contain', 'input label')
      .and('contain', 'textarea label')
      .and('contain', 'radio label')
      .and('contain', 'checkbox label')
      .and('contain', 'select label');
  });
});
