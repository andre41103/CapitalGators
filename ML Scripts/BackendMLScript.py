#!/usr/bin/env python
# coding: utf-8

import logging
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import pickle
import calendar
from datetime import datetime
import sys

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

def plot_user_spending(prediction, daily_spending, purchase_dates, export_path='spending_projection.png'):
    print(f"Predicted projected monthly spending: ${prediction:.2f}")
    
    cumulative_spending = np.cumsum(daily_spending)
    first_date = datetime.strptime(purchase_dates[0], '%Y-%m-%d')
    _, total_days_in_month = calendar.monthrange(first_date.year, first_date.month)
    
    days_of_month = [datetime.strptime(date, '%Y-%m-%d').day for date in purchase_dates]

    plt.figure(figsize=(8, 5))
    plt.plot(days_of_month, cumulative_spending, 'go-', label="Actual Spending")

    last_day = days_of_month[-1]
    last_total = cumulative_spending[-1]
    future_days = [last_day, total_days_in_month]
    future_spending = [last_total, prediction]
    plt.plot(future_days, future_spending, '--', label='Predicted Spending', color='darkgreen')

    plt.plot(total_days_in_month, prediction, marker='*', color='orange', markersize=12, label='Predicted Total')

    plt.xlabel("Day of the Month")
    plt.ylabel("Total Spent ($)")
    plt.title(f"Estimated Month Projection (Predicted: ${prediction:.2f})")
    plt.xlim(1, total_days_in_month+1)
    plt.ylim(bottom=0)
    plt.grid(True)
    plt.legend()

    plt.tight_layout()
    plt.savefig(export_path)
    plt.show()

# Set up logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)

total = float(sys.argv[1])
date_range = float(sys.argv[2])
recurring_total = float(sys.argv[3])

date = sys.argv[4]
purchase_dates = date.split(",")
spending = sys.argv[5]
spending_string = spending.split(",")

daily_spending = []

for x in spending_string:
    try:
        daily_spending.append(float(x))
    except ValueError:
        daily_spending.append(0.0)

logging.info(f"Total: {total}, Date Range: {date_range}, Recurring Total: {recurring_total}")
logging.info(f"Purchase Dates: {daily_spending}")
logging.info(f"Spending String: {spending_string}")

prediction = predict_monthly_spending(total, date_range, recurring_total)
plot_user_spending(prediction, daily_spending, purchase_dates)
