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

  it('renders login form fields', () => {
    cy.get('input#email').should('exist').and('have.attr', 'type', 'email');
    cy.get('input#password').should('exist').and('have.attr', 'type', 'password');
    cy.get('button').contains('Login');
    cy.contains("Don't have an account yet?");
  });

  it('allows typing into email and password fields', () => {
    cy.get('#email').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('#password').type('secret').should('have.value', 'secret');
  });

  it('calls login API and navigates on success', () => {
    cy.intercept('POST', 'http://localhost:8080/login', {
      statusCode: 200,
      body: { email: 'test@example.com' }
    }).as('loginRequest');

    cy.get('#email').type('test@example.com');
    cy.get('#password').type('password123');
    cy.get('button').contains('Login').click();

    cy.wait('@loginRequest');
    cy.then(() => {
      expect(localStorage.getItem('userEmail')).to.eq('test@example.com');
    });
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
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('navigates to sign up page when "Sign up here" is clicked', () => {
    cy.window().then((win) => {
      cy.stub(win, 'fetch'); // Prevent real network requests
      cy.stub(win.history, 'pushState').as('navigate');
    });
    cy.get('.new-account-link').click();
    cy.url().should('include', '/create_account');
  });

  it('navigates to about page when question mark is clicked', () => {
    cy.get('.question-login').click();
    cy.url().should('include', '/about');
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
});
