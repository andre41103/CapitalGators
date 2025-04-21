#!/usr/bin/env python
# coding: utf-8

# In[9]:


import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pickle
import calendar
from datetime import datetime


# In[2]:


# Define variables for all the items that the model will use (everything in the user_total.json) -- query all of these fields from the database
# and store in variables


# In[3]:


# Query all individual receipts for the graph (this should show date of purchase and add the current receipt to the overall total 
# and plot current_total += new_receipt_total) -- anytime current total updates add point to graph


# In[11]:


def predict_monthly_spending(total, date_range, recurring_total):
    
    with open('random_forest_model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('model_features.pkl', 'rb') as f:
        features = pickle.load(f)

    data_dict = {
        'total': total,
        'date_range': date_range,
        'recurring_total': recurring_total,
    }
    X_new = pd.DataFrame([data_dict], columns=features)
    prediction = model.predict(X_new)[0]
    
    return prediction


# In[5]:


# Feed user_total.json into trained model -> will be parameters in the model


# In[6]:


# model -> single number reflecting projected monthly spending


# In[7]:


# plot number above on day 30 or 31 depending on the month and make dashed line connecting them


# In[53]:


def plot_user_spending(prediction, daily_spending, purchase_dates, export_path='spending_projection.png'):
    print(f"Predicted projected monthly spending: ${prediction:.2f}")
    
    # Calculate cumulative spending
    cumulative_spending = np.cumsum(daily_spending)

    # Get number of days in the month from the first purchase date
    first_date = datetime.strptime(purchase_dates[0], '%Y-%m-%d')
    _, total_days_in_month = calendar.monthrange(first_date.year, first_date.month)
    
    # Convert all purchase_dates to day-of-month integers
    days_of_month = [datetime.strptime(date, '%Y-%m-%d').day for date in purchase_dates]

    # Create plot
    plt.figure(figsize=(8, 5))

    # Plot actual points with line
    plt.plot(days_of_month, cumulative_spending, 'go-', label="Actual Spending")  # solid line + green dots

    # Projected dotted line
    last_day = days_of_month[-1]
    last_total = cumulative_spending[-1]
    future_days = [last_day, total_days_in_month]
    future_spending = [last_total, prediction]
    plt.plot(future_days, future_spending, '--', label='Predicted Spending', color='darkgreen')

    # Plot estimated month target
    plt.plot(total_days_in_month, prediction, marker='*', color='orange', markersize=12, label='Predicted Total')

    # Set the labels
    plt.xlabel("Day of the Month")
    plt.ylabel("Total Spent ($)")
    plt.title(f"Estimated Month Projection (Predicted: ${prediction:.2f})")
    plt.xlim(1, total_days_in_month+1)
    plt.ylim(bottom=0)
    plt.grid(True)
    plt.legend()

    # Save the plot
    plt.tight_layout()
    plt.savefig(export_path)
    plt.show()


# In[9]:


# tell andrea and carolina -> note only display once 4 non recurring receipts have been populated for the month
# otherwise blur out graph with note to add x more receipts to unlock porojected spending


# In[55]:


# This is just a hard coded example of using the functions
# The data needs to be queried and passed in as parameters to the functions!!

# total = 996.62
# date_range = 21
# recurring_total = 900
# daily_spending = [50, 900, 23.62, 23]
# purchase_dates = ['2025-04-02', '2025-04-10', '2025-04-15', '2025-04-21']

# # call model to make prediction
# prediction = predict_monthly_spending(total, date_range, recurring_total)

# # generate graph based on model
# plot_user_spending(prediction, daily_spending, purchase_dates)


# In[ ]:




