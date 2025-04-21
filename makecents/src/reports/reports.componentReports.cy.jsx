import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Reports from './reports.component';

describe('Reports Component', () => {
  beforeEach(() => {
    localStorage.setItem('userEmail', 'test@example.com');
  });

  function mountWithMocks({
    receipts = [],
    profile = { spendingGoal: 500 },
    graphBlob = new Blob(['fake'], { type: 'image/png' }),
  } = {}) {
    cy.intercept('GET', 'http://localhost:8080/profile/test@example.com', profile).as('getProfile');
    cy.intercept('GET', 'http://localhost:8080/reports/test@example.com', receipts).as('getReceipts');
    cy.intercept('GET', 'http://localhost:8080/dashboard/test@example.com/graph', {
      statusCode: 200,
      body: graphBlob,
    }).as('getGraph');
    cy.mount(
      <MemoryRouter>
        <Reports />
      </MemoryRouter>
    );
  }

  it('renders navigation bar and profile avatar', () => {
    mountWithMocks();
    cy.get('.navbar').within(() => {
      cy.contains('MakeCents').should('exist');
      cy.contains('Education Resources').should('exist');
      cy.contains('Reports').should('have.class', 'active');
      cy.contains('Receipt Entry').should('exist');
      cy.get('img[alt="Profile"]').should('be.visible');
    });
  });

  it('shows loading state for projected spending chart', () => {
    mountWithMocks();
    cy.get('.loading-spinner').should('contain', 'Loading chart...');
  });

  it('shows blurred projected spending chart and overlay if <4 receipts', () => {
    const receipts = [
      { date: '2025-04-01', receipt_type: 'Food & Dining', total: 10, recurring: false },
      { date: '2025-04-02', receipt_type: 'Leisure', total: 20, recurring: false },
      { date: '2025-04-03', receipt_type: 'Housing & Utilities', total: 30, recurring: false },
    ];
    mountWithMocks({ receipts });
    cy.get('.projected-graph-image.reports-blurred').should('exist');
    cy.get('.reports-graph-overlay-message').should('contain', 'Add at least 4 receipts from this month');
  });

  it('shows "No receipts found" when there are no receipts', () => {
    mountWithMocks({ receipts: [] });
    cy.contains('No receipts found').should('be.visible');
  });

  it('renders receipt list when receipts exist', () => {
    const receipts = [
      {
        merchant_name: 'Amazon',
        receipt_type: 'Leisure',
        total: 120,
        date: '2025-04-05',
        notes: 'Prime subscription',
        recurring: true,
      },
      {
        merchant_name: 'Walmart',
        receipt_type: 'Food & Dining',
        total: 80,
        date: '2025-04-06',
        notes: 'Groceries',
        recurring: false,
      },
    ];
    mountWithMocks({ receipts });
    cy.get('.receipt-item').should('have.length', 2);
    cy.contains('Merchant: Amazon');
    cy.contains('Category: Leisure');
    cy.contains('Total: $120.00');
    cy.contains('Recurring');
    cy.contains('Merchant: Walmart');
    cy.contains('Category: Food & Dining');
    cy.contains('Total: $80.00');
  });

  it('shows top 3 categories by spending', () => {
    const receipts = [
      { date: '2025-04-01', receipt_type: 'Leisure', total: 100, recurring: false },
      { date: '2025-04-02', receipt_type: 'Leisure', total: 50, recurring: false },
      { date: '2025-04-03', receipt_type: 'Food & Dining', total: 80, recurring: false },
      { date: '2025-04-04', receipt_type: 'Housing & Utilities', total: 60, recurring: false },
    ];
    mountWithMocks({ receipts });
    cy.get('.top-categories-container').within(() => {
      cy.get('.category-box').should('have.length', 3);
      cy.contains('Leisure');
      cy.contains('Food & Dining');
      cy.contains('Housing & Utilities');
    });
  });

  it('shows "No spending data available" if no categories', () => {
    mountWithMocks({ receipts: [] });
    cy.get('.top-categories-container').should('contain', 'No spending data available');
  });

  it('shows add receipt prompt in insights if no receipts', () => {
    mountWithMocks({ receipts: [] });
    cy.get('.insights-box').should('contain', 'Add a receipt to view your budgeting insights');
  });

  it('shows upcoming bills for recurring receipts', () => {
    const receipts = [
      { merchant_name: 'Netflix', total: 15, recurring: true, date: '2025-04-01', receipt_type: 'Leisure', notes: '' },
      { merchant_name: 'Spotify', total: 10, recurring: true, date: '2025-04-02', receipt_type: 'Leisure', notes: '' },
    ];
    mountWithMocks({ receipts });
    cy.get('.recurring-list').within(() => {
      cy.contains('Netflix subscription ($15.00) is due next month');
      cy.contains('Spotify subscription ($10.00) is due next month');
    });
  });

  it('shows "No recurring expenses found" if no recurring receipts', () => {
    mountWithMocks({ receipts: [] });
    cy.get('.recurring-expenses-box').should('contain', 'No recurring expenses found');
  });

});
