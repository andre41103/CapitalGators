import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './profile.component.jsx';

describe('Profile Form', () => {
  beforeEach(() => {
    // Seed localStorage before mount
    localStorage.setItem('userEmail', 'test@example.com');
    localStorage.setItem('userPassword', 'password123');

    cy.intercept('GET', 'http://localhost:8080/profile/test@example.com', {
      statusCode: 200,
      body: {
        username: 'Test User',
        email: 'test@example.com',
        monthlyIncome: 4000,
        spendingGoal: 2000,
        selectedCategories: ['Rent'],
        selectedTopics: ['Technology'],
      },
    }).as('getProfile');

    cy.mount(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    cy.wait('@getProfile');
  });

  it('renders the user information correctly', () => {
    cy.get('.custom-h1-profile').should('contain', 'Hello Test User');
    cy.get('.custom-h1-profile').should('contain', 'test@example.com');
  });

  it('enables edit mode and updates income and spending goal', () => {
    cy.contains('Edit information').click();
    cy.get('input[name="monthly income"]').clear().type('5000');
    cy.get('input[name="monthly spending goal"]').clear().type('2500');
    cy.get('input[name="monthly income"]').should('have.value', '5000');
    cy.get('input[name="monthly spending goal"]').should('have.value', '2500');
  });

  it('toggles category selection', () => {
    cy.contains('Rent').should('have.class', 'selected');
    cy.contains('Edit information').click();
    cy.contains('Rent').click().should('not.have.class', 'selected');
    cy.contains('Groceries').click().should('have.class', 'selected');
  });

  it('toggles news topic selection', () => {
    cy.contains('Technology').should('have.class', 'selected');
    cy.contains('Edit information').click();
    cy.contains('Technology').click().should('not.have.class', 'selected');
    cy.contains('Politics').click().should('have.class', 'selected');
  });

  it('saves the profile successfully', () => {
    cy.intercept('PUT', 'http://localhost:8080/profile/test@example.com', {
      statusCode: 200,
      body: {},
    }).as('updateProfile');

    cy.contains('Edit information').click();
    cy.get('input[name="monthly income"]').clear().type('6000');
    cy.get('input[name="monthly spending goal"]').clear().type('3000');
    cy.contains('Groceries').click();
    cy.contains('Politics').click();
    cy.contains('Save').click();

    cy.wait('@updateProfile').its('request.body').should('deep.include', {
      username: 'Test User',
      monthlyIncome: 6000,
      spendingGoal: 3000,
    });
  });
});
