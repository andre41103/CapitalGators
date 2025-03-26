import React, { useState, useEffect } from 'react';
import './resources.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Resources = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [userMessage, setUserMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/resources'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                
                // Convert HTML entities
                const modifiedData = data.props.pageProps.pageData['category-page'].collection.cards.map(card => {
                    card.name = card.name.replace(/&#174;|&reg;/g, '®');
                    return card;
                });

                setCards(modifiedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const sendMessage = async () => {
        if (!userMessage.trim()) return; // Ignore empty messages

        const newMessage = { role: "user", content: userMessage };
        setChatMessages(prev => [...prev, newMessage]); // Add user message

        try {
            const response = await fetch('http://localhost:8080/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userinput: userMessage })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chatbot response');
            }

            const data = await response.json();
            const botResponse = { role: "bot", content: data.response };
            setChatMessages(prev => [...prev, botResponse]); // Add bot message
        } catch (error) {
            console.error('Error:', error);
            setChatMessages(prev => [...prev, { role: "bot", content: "Error fetching response" }]);
        }

        setUserMessage(''); // Clear input field
    };

    return (
        <>
            <div className="navbar">
                <a href="/dashboard" className="nav-make">MakeCents</a>
                <a href="/resources" className="nav-link active">Education Resources</a>
                <a href="/reports" className="nav-link">Reports</a>
                <a href="/receipts" className="nav-link">Receipt Entry</a>
                <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={() => navigate('/profile')} />
            </div>

            <div className="resources-content">
                <div className="vertical-containers">
                    <div className='resources-container-wrapper'>
                        <h3 className='container-title'>Important Credit Card Information</h3>
                        <div className="individual-vertical-container resource-scrollable-container">
                            <div className='scroll-content'>
                                {cards.length > 0 ? (
                                    cards.map((card, index) => (
                                        <div key={index} className="card-info">
                                            <h4>{card.name}</h4>
                                            <p><strong>Issuer:</strong> {card.relationships.issuer.name}</p>
                                            
                                            <h5>Intro Bonuses:</h5>
                                            {card.attributes.introBonuses.map((bonus, idx) => (
                                                <p key={idx}>{bonus.description}</p>
                                            ))}

                                            <h5>Reward Rates:</h5>
                                            {card.attributes.rewardRates.map((rate, idx) => (
                                                <p key={idx}>{rate.explanation}</p>
                                            ))}

                                            <h5>Why Like This:</h5>
                                            {card.variations.map((variation, idx) => (
                                                <p key={idx}>{variation.whyLikeThis}</p>
                                            ))}
                                        </div>
                                    ))
                                ) : (
                                    <p>Loading credit card data...</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chatbox Integration */}
                    <div className='resources-container-wrapper'>
                        <h3 className='container-title'>Financial Chatbox</h3>
                        <div className="individual-vertical-container chatbox-container">
                            <div className="chatbox">
                                <div className="chat-messages">
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.role}`}>
                                            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
                                        </div>
                                    ))}
                                </div>
                                <div className="chat-input">
                                    <input
                                        type="text"
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        placeholder="Ask me something..."
                                    />
                                    <button onClick={sendMessage}>Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Resources;
