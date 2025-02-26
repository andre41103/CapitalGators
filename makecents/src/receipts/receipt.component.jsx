import React, { useState } from 'react';
import './receipt.component.css';

const Receipts = () => {
  const [isManualEntry, setIsManualEntry] = useState(true);

  return (
    <div className="receipts">
       <h1>Receipts Page</h1>
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
        {/* Conditional Form Rendering */}
        {isManualEntry ? (
          <div className="form-container-receipts">
            <div className="form-group-receipts">
              <label htmlFor="merchant_name">Merchant Name:</label>
              <input type="text" id="merchant_name" name="merchant_name" placeholder="Merchant Name" />

              <label htmlFor="purchase_category">Purchase Category:</label>
              <input type="text" id="purchase_category" name="purchase_category" placeholder="Purchase Category" />

              <label htmlFor="total_spent">Total Amount Spent:</label>
              <input type="text" id="total_spent" name="total_spent" placeholder="$0.00" />

              <label htmlFor="notes">Additional Notes:</label>
              <input type="text" id="notes" name="notes" placeholder="Additional Notes" />
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

      <footer className="footer"></footer>
    </div>
  );
};

export default Receipts;
