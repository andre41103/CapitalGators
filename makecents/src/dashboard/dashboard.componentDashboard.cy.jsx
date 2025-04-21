import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './dashboard.component';

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Set up user email in localStorage for API calls
    localStorage.setItem('userEmail', 'test@example.com');
  });

  function mountWithMocks({ receipts = [], stocks = [], profile = {}, graphBlob = new Blob(['fake'], { type: 'image/png' }) } = {}) {
    cy.intercept('GET', 'http://localhost:8080/dashboard', stocks).as('getStocks');
    cy.intercept('GET', 'http://localhost:8080/profile/test@example.com', profile).as('getProfile');
    cy.intercept('GET', 'http://localhost:8080/reports/test@example.com', receipts).as('getReceipts');
    cy.intercept('GET', 'http://localhost:8080/dashboard/test@example.com/graph', {
      statusCode: 200,
      body: graphBlob,
    }).as('getGraph');
    cy.mount(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  }

  it('renders navigation bar and profile avatar', () => {
    mountWithMocks();
    cy.get('.navbar').within(() => {
      cy.contains('MakeCents').should('have.class', 'active');
      cy.contains('Education Resources').should('exist');
      cy.contains('Reports').should('exist');
      cy.contains('Receipt Entry').should('exist');
      cy.get('img[alt="Profile"]').should('be.visible');
    });
  });

  it('shows empty state for spending chart when no receipts', () => {
    mountWithMocks({ receipts: [], stocks: [] });
    cy.contains('Add receipts to see spendings').should('be.visible');
    cy.get('.dashboard-container-title').contains('Spending by Category');
  });

  it('renders budget usage chart with correct values', () => {
    const receipts = [
      { date: '2025-04-01', receipt_type: 'Food & Dining', total: 50 },
      { date: '2025-04-02', receipt_type: 'Leisure', total: 30 },
    ];
    const profile = { spendingGoal: 120 };
    mountWithMocks({ receipts, profile });
    cy.get('.dashboard-container-title').contains('Budget Usage');
    cy.get('svg').should('exist'); // PieChart SVG for budget
    cy.contains('Spent');
    cy.contains('Remaining');
  });

  it('shows projected spending chart only with enough receipts', () => {
    // Fewer than 4 receipts: shows blurred and overlay
    const fewReceipts = [
      { date: '2025-04-01', receipt_type: 'Food & Dining', total: 10 },
      { date: '2025-04-02', receipt_type: 'Leisure', total: 20 },
      { date: '2025-04-03', receipt_type: 'Housing & Utilities', total: 30 },
    ];
    mountWithMocks({ receipts: fewReceipts });
    cy.contains('Add at least 4 receipts from this month to view your projected spending chart').should('be.visible');
    cy.get('.projected-graph-image.blurred').should('exist');

    // 4+ receipts: shows actual graph image
    const enoughReceipts = [
      ...fewReceipts,
      { date: '2025-04-04', receipt_type: 'Transportation', total: 40 },
    ];
    mountWithMocks({ receipts: enoughReceipts });
    cy.get('.projected-graph-image').should('be.visible');
  });

  it('renders stock information when stocks are present', () => {
    const stocks = [
      { ticker: 'AAPL', name: 'Apple', price: 150.12 },
      { ticker: 'GOOG', name: 'Google', price: 2750.00 },
    ];
    mountWithMocks({ stocks });
    cy.get('.dashboard-container-title').contains('Stock Information');
    cy.contains('AAPL');
    cy.contains('Apple');
    cy.contains('GOOG');
    cy.contains('Google');
  });

  it('shows loading message when stocks are not yet loaded', () => {
    mountWithMocks({ stocks: [] });
    cy.contains('Loading stock data...').should('be.visible');
  });
});
