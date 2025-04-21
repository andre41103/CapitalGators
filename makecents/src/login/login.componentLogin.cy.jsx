import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Login from './login.component';

describe('Login Component', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });

  it('renders all expected elements', () => {
    cy.get('.login-header').should('contain', 'MakeCents');
    cy.get('input#email').should('exist');
    cy.get('input#password').should('exist');
    cy.get('button').contains('Log In').should('exist');
    cy.get('.signup-prompt').should('contain', "Don't have an account yet?");
    cy.get('.new-account-link').should('contain', 'Sign up here');
    cy.get('img[alt="Plant"]').should('have.length', 2);
    cy.get('img[alt="question"]').should('exist');
  });

  it('allows typing into email and password fields', () => {
    cy.get('#email').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('#password').type('secret').should('have.value', 'secret');
  });

  it('shows error message on failed login', () => {
    cy.intercept('POST', 'http://localhost:8080/login', {
      statusCode: 401,
      body: { error: 'Invalid credentials' }
    }).as('loginFail');

    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpass');
    cy.get('button').click();

    cy.wait('@loginFail');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  it('submits form on Enter key press in password field', () => {
    cy.intercept('POST', 'http://localhost:8080/login', {
      statusCode: 200,
      body: { email: 'enter@example.com' }
    }).as('enterLogin');

    cy.get('#email').type('enter@example.com');
    cy.get('#password').type('secret{enter}');
    cy.wait('@enterLogin');
  });

  it('shows network error on network failure', () => {
    cy.intercept('POST', 'http://localhost:8080/login', { forceNetworkError: true }).as('networkFail');
    cy.get('#email').type('test@example.com');
    cy.get('#password').type('secret');
    cy.get('button').click();
    cy.wait('@networkFail');
    cy.get('.error-message').should('contain', 'Network error');
  });
});
