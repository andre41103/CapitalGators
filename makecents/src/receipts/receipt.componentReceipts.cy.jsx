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

  it('accepts form input values', () => {
    cy.get('#merchant_name')
      .clear()
      .type("Trader Joe's")
      .should('have.value', "Trader Joe's");
  
    cy.get('#receipt_type')
      .select('Food & Dining')
      .should('have.value', 'Food & Dining');
  
    cy.get('#total')
      .clear()
      .type('45.23')
      .should('have.value', '45.23');
  
    cy.get('#date')
      .clear()
      .type('2024-04-15')
      .should('have.value', '2024-04-15');
  
    cy.get('#notes')
      .clear()
      .type('Weekly groceries')
      .should('have.value', 'Weekly groceries');
  
    cy.get('#recurring').check().should('be.checked');
  });
  
  it('submits form and sends POST request', () => {
    cy.intercept('POST', 'http://localhost:8080/receipts/test@example.com', (req) => {
      // Validate request body inline instead of in `.then`
      expect(req.body.merchant_name).to.eq('Starbucks');
      expect(req.body.receipt_type).to.eq('Leisure');
      expect(req.body.total).to.eq(5.75);
      expect(req.body.date).to.eq('2024-04-16');
      expect(req.body.notes).to.eq('Coffee');
      expect(req.body.recurring).to.be.true;
      req.reply({ success: true });
    }).as('submitReceipt');
  
    cy.get('#merchant_name').clear().type('Starbucks');
    cy.get('#receipt_type').select('Leisure');
    cy.get('#total').clear().type('5.75');
    cy.get('#date').clear().type('2024-04-16');
    cy.get('#notes').clear().type('Coffee');
    cy.get('#recurring').check();
  
    cy.contains('Save Receipt').click();
    cy.wait('@submitReceipt');
  });
  
  it('navigates to profile on avatar click', () => {
    cy.get('.avatar-icon').click();
    cy.location('pathname').should('include', '/profile');
  });  
});
