import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Create_Account from './create_account.component';

describe('Create Account Form', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Create_Account />
      </MemoryRouter>
    );
  });

  it('displays warning if fields are empty', () => {
    cy.contains('Return to Login').click();

    cy.contains('Please complete all correctly fields and select at least one category and topic.')
      .should('be.visible');
  });

  it('submits successfully with all fields filled', () => {
    cy.get('input[name="name"]').type('Andrea Sanchez');
    cy.get('input[name="email address"]').type('andrea@example.com');
    cy.get('input[name="password"]').type('securePassword123');
    cy.get('input[name="monthly income"]').type('5000');
    cy.get('input[name="monthly spending goal"]').type('2000');

    // one category and one topic
    cy.contains('Groceries').click();
    cy.contains('Stock Market').click();

    cy.intercept('POST', 'http://localhost:8080/create_account', {
      statusCode: 200,
      body: { message: 'Account created successfully' },
    }).as('createAccount');

    cy.contains('Return to Login').click();

    cy.wait('@createAccount').its('request.body').should('deep.include', {
      username: 'Andrea Sanchez',
      email: 'andrea@example.com',
      monthlyIncome: 5000,
      spendingGoal: 2000,
    });
  });

  it('allows selecting and unselecting categories and topics', () => {
    cy.contains('Groceries').click().should('have.class', 'selected');
    cy.contains('Groceries').click().should('not.have.class', 'selected');

    cy.contains('Technology').click().should('have.class', 'selected');
    cy.contains('Technology').click().should('not.have.class', 'selected');
  });

  it('keeps password input masked', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('prevents submission if categories/topics are missing', () => {
    cy.get('input[name="name"]').type('Andrea');
    cy.get('input[name="email address"]').type('test@example.com');
    cy.get('input[name="password"]').type('pw123');
    cy.get('input[name="monthly income"]').type('1000');
    cy.get('input[name="monthly spending goal"]').type('400');

    cy.contains('Return to Login').click();
    cy.contains('Please complete all correctly fields and select at least one category and topic.')
      .should('be.visible');
  });

  it('shows and clears the warning after valid submission', () => {
    cy.contains('Return to Login').click();
    cy.contains('Please complete all correctly fields').should('exist');

    cy.get('input[name="name"]').type('A');
    cy.get('input[name="email address"]').type('a@a.com');
    cy.get('input[name="password"]').type('123');
    cy.get('input[name="monthly income"]').type('100');
    cy.get('input[name="monthly spending goal"]').type('50');
    cy.contains('Rent').click();
    cy.contains('Politics').click();

    cy.intercept('POST', 'http://localhost:8080/create_account', {
      statusCode: 200,
      body: {},
    });

    cy.contains('Return to Login').click();
    cy.contains('Please complete all correctly fields').should('not.exist');
  });
});
