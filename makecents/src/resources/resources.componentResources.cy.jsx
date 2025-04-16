import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Resources from './resources.component.jsx';

describe('Resources Component', () => {
  beforeEach(() => {
    // cards fetch
    cy.intercept('GET', 'http://localhost:8080/resources', {
      statusCode: 200,
      body: {
        props: {
          pageProps: {
            pageData: {
              'category-page': {
                collection: {
                  cards: [
                    {
                      name: 'Capital One Quicksilver&#174;',
                      relationships: {
                        issuer: { name: 'Capital One' },
                      },
                      attributes: {
                        introBonuses: [{ description: 'Earn $200 after $500 spent' }],
                        rewardRates: [{ explanation: '1.5% on every purchase' }],
                      },
                      variations: [{ whyLikeThis: 'No annual fee and cashback' }],
                    },
                  ],
                },
              },
            },
          },
        },
      },
    }).as('getCards');

    cy.mount(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    );

    cy.wait('@getCards');
  });

  it('renders the credit card data correctly', () => {
    cy.contains('Capital One Quicksilver®').should('exist');
    cy.contains('Capital One').should('exist');
    cy.contains('Earn $200 after $500 spent').should('exist');
    cy.contains('1.5% on every purchase').should('exist');
    cy.contains('No annual fee and cashback').should('exist');
  });

  it('displays loading state when no cards are available', () => {
    // Mount with empty data
    cy.intercept('GET', 'http://localhost:8080/resources', {
      statusCode: 200,
      body: {
        props: {
          pageProps: {
            pageData: {
              'category-page': {
                collection: { cards: [] },
              },
            },
          },
        },
      },
    }).as('emptyCards');

    cy.mount(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    );

    cy.contains('Loading credit card data...').should('exist');
  });

  it('displays user and bot messages in the chatbox', () => {
    cy.get('input[placeholder="Ask me something..."]').type('What’s a good card for students?');
    cy.intercept('POST', 'http://localhost:8080/chatbot', {
      statusCode: 200,
      body: { response: 'The Discover It Student card is a great choice!' },
    }).as('chatReply');

    cy.contains('Send').click();
    cy.wait('@chatReply');

    cy.contains('You:').should('exist');
    cy.contains('What’s a good card for students?').should('exist');
    cy.contains('Bot:').should('exist');
    cy.contains('The Discover It Student card is a great choice!').should('exist');
  });

  it('does not send empty chatbot messages', () => {
    cy.contains('Send').click();
    cy.get('.chat-message').should('not.exist');
  });

  it('shows error message if chatbot fetch fails', () => {
    cy.get('input[placeholder="Ask me something..."]').type('Tell me about cashback cards');

    cy.intercept('POST', 'http://localhost:8080/chatbot', {
      statusCode: 500,
      body: {},
    }).as('chatFail');

    cy.contains('Send').click();
    cy.wait('@chatFail');
    cy.contains('Error fetching response').should('exist');
  });
});
