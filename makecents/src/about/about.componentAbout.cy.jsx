import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import About from './about.component';

describe('About Component', () => {
  beforeEach(() => {
    cy.mount(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
  });

  it('renders the about header and description', () => {
    cy.get('.about-header').should('contain', 'About MakeCents');
    cy.get('.textbox').should('contain', 'MakeCents is a web based program');
  });

  it('shows plant image and return button', () => {
    cy.get('img.plant-image').should('be.visible').and('have.attr', 'alt', 'Plant');
    cy.get('button.about_button').should('contain', 'Return to Login');
  });

  it('renders the footer', () => {
    cy.get('.footer').should('exist');
  });
});
