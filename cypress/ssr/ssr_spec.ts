/// <reference types="cypress" />

describe('Server side rendering', () => {
  ['material', 'bootstrap', 'kendo', 'primeng', 'antd'].forEach((ui) => {
    it(`should hydrate ${ui} inputs`, () => {
      cy.visit(`/${ui}`);
      cy.get('formly-app-ui [ngh]').should('not.exist');
      cy.get('input[placeholder="input placeholder"]')
        .should('be.enabled')
        .type('Angular 20')
        .should('have.value', 'Angular 20')
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
