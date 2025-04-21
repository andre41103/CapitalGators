import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Receipts from './receipt.component';

describe('Receipts Component', () => {
  beforeEach(() => {
    localStorage.setItem('userEmail', 'test@example.com');
    cy.mount(
      <MemoryRouter>
        <Receipts />
      </MemoryRouter>
    );
  });

  it('renders manual entry form by default', () => {
    cy.get('input#merchant_name').should('exist');
    cy.get('select#receipt_type').should('exist');
    cy.get('input#total').should('exist');
    cy.get('input#date').should('exist');
    cy.get('input#notes').should('exist');
    cy.get('input#recurring[type="checkbox"]').should('exist');
    cy.get('button').contains('Save Receipt');
  });

  it('toggles to upload mode and back', () => {
    cy.contains('Upload Receipt').click();
    cy.get('input[type="file"]').should('exist');
    cy.contains('Manual Entry').click();
    cy.get('input#merchant_name').should('exist');
  });

  it('handles failed manual entry submission gracefully', () => {
    cy.intercept('POST', 'http://localhost:8080/receipts/test@example.com', {
      statusCode: 500,
      body: { error: 'Failed to upload receipt' }
    }).as('saveReceiptFail');

    cy.get('input#merchant_name').type('Target');
    cy.get('button').contains('Save Receipt').click();
    cy.wait('@saveReceiptFail');
    // There is no visible error message in the UI, but you can check console error if needed
  });

  it('renders navigation links', () => {
    cy.get('.navbar').within(() => {
      cy.contains('MakeCents').should('have.attr', 'href', '/dashboard');
      cy.contains('Education Resources').should('have.attr', 'href', '/resources');
      cy.contains('Reports').should('have.attr', 'href', '/reports');
      cy.contains('Receipt Entry').should('have.class', 'active');
    });
  });
});
