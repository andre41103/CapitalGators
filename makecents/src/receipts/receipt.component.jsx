import React, { useState } from 'react';
import './receipt.component.css';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/avatar.png';

const Receipts = () => {
  const [isManualEntry, setIsManualEntry] = useState(true);
  const [merchantName, setMerchantName] = useState('');
  const [receiptType, setReceiptType] = useState('');
  const [total, setTotal] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [recurring, setRecurring] = useState(false);

  const navigate = useNavigate();
  const handleProfile = () => {
    navigate('/profile');
  };

  const handleSaveReceipt = () => {
    const receiptData = {
      merchant_name: merchantName,
      receipt_type: receiptType,
      total: parseFloat(total),
      date: date || null,
      notes: notes,
      recurring: recurring,
    };
  
    console.log('Submitting receipt data:', receiptData);
  
    // Get user email (from localStorage or another method)
    const userEmail = localStorage.getItem('userEmail'); // or from state/context
  
    // Send data to backend via POST request
    fetch(`http://localhost:8080/receipts/${userEmail}`, { // Replace 8080 with your backend's port if different
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    })
       
      .then(response => {
        // Check if the response is OK (status 200-299)
        if (!response.ok) {
          throw new Error('Failed to upload receipt');
        }
  
        // Try to parse the response JSON
        return response.json().catch((err) => {
          throw new Error('Invalid JSON response');
        });
      })
      .then(data => {
        console.log('Success:', data);
        resetForm(); // Optionally reset the form after successful submission
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };  

  const resetForm = () => {
    setMerchantName('');
    setReceiptType('');
    setTotal('');
    setDate('');
    setNotes('');
    setRecurring(false);
  };

  return (
    <>

    <div className="navbar">
    <a href="/dashboard" className="nav-make">MakeCents</a>
      <a href="/resources" className="nav-link">Education Resources</a>
      <a href="/reports" className="nav-link">Reports</a>
      <a href="/receipts" className="nav-link active">Receipt Entry</a>
      <img src={avatarImage} alt="Profile" className="avatar-icon" onClick={handleProfile} />
    </div>
    
    <div className="receipts">
        <div className="toggle-container">
          <button
            className={`toggle-button ${isManualEntry ? 'active' : ''}`}
            onClick={() => setIsManualEntry(true)}
          >
            Manual Entry
          </button>
          <button
            className={`toggle-button ${!isManualEntry ? 'active' : ''}`}
            onClick={() => setIsManualEntry(false)}
          >
            Upload Receipt
          </button>
        </div>

        <div className="content-container-receipts">
          {isManualEntry ? (
            <div className="form-container-receipts">
              <div className="form-group-receipts">
                <label htmlFor="merchant_name">Merchant Name:</label>
                <input
                  type="text"
                  id="merchant_name"
                  name="merchant_name"
                  placeholder="Merchant Name"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)} />

                <label htmlFor="receipt_type">Purchase Category:</label>
                <input
                  type="text"
                  id="receipt_type"
                  name="receipt_type"
                  placeholder="Purchase Category"
                  value={receiptType}
                  onChange={(e) => setReceiptType(e.target.value)} />

                <label htmlFor="total">Total Amount Spent:</label>
                <input
                  type="text"
                  id="total"
                  name="total"
                  placeholder="$0.00"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)} />

                <label htmlFor="date">Transaction Date:</label>
                <input
                  type="text"
                  id="date"
                  name="date"
                  placeholder="YYYY-MM-DD"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} />

                <label htmlFor="notes">Additional Notes:</label>
                <input
                  type="text"
                  id="notes"
                  name="notes"
                  placeholder="Additional Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)} />

                <div className="checkbox-container-receipts">
                  <label className="receipt-checkbox">
                    <input
                      type="checkbox"
                      id="recurring"
                      name="recurring"
                      checked={recurring}
                      onChange={(e) => setRecurring(e.target.checked)} />
                    <span className="checkmark"></span>
                    If this is a monthly purchase, check here to automate your budget tracker
                  </label>
                </div>

                <button className="button-receipts" onClick={handleSaveReceipt}>
                  Save Receipt
                </button>
              </div>
            </div>
          ) : (
            <div className="form-container-receipts">
              <div className="form-group-receipts">
                <label htmlFor="receipt_upload">Upload Receipt:</label>
                <input type="file" id="receipt_upload" name="receipt_upload" />
              </div>
            </div>
          )}
        </div>

        {/* <footer className="footer"></footer> */}
    </div></>
  );
};

export default Receipts;
