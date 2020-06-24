/// <reference types="cypress" />

describe('Server side rendering', () => {
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
});
