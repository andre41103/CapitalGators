#!/usr/bin/env python
# coding: utf-8

# In[1]:


import os
import shutil
import random
import pickle
import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
import pickle


# In[2]:


# Split users into train and test folders
users_dir = 'users'
train_dir = 'train'
test_dir = 'test'

os.makedirs(train_dir, exist_ok=True)
os.makedirs(test_dir, exist_ok=True)

user_folders = [f for f in os.listdir(users_dir) if os.path.isdir(os.path.join(users_dir, f))]
random.shuffle(user_folders)
split_index = int(len(user_folders) * 0.8)

train_users = user_folders[:split_index]
test_users = user_folders[split_index:]

for user in train_users:
    shutil.move(os.path.join(users_dir, user), os.path.join(train_dir, user))

for user in test_users:
    shutil.move(os.path.join(users_dir, user), os.path.join(test_dir, user))

print(f"Moved {len(train_users)} users to '{train_dir}/' and {len(test_users)} users to '{test_dir}/'.")


# In[3]:


# Load features from user_total.json
def load_user_totals(root_dir):
    data = []
    targets = []
    for user in os.listdir(root_dir):
        user_path = os.path.join(root_dir, user)
        total_path = os.path.join(user_path, 'user_total.json')

        if os.path.isfile(total_path):
            try:
                with open(total_path, 'r') as f:
                    info = json.load(f)

                total = info.get('total')
                date_range = info.get('date_range')
                recurring_total = info.get('recurring_total', 0)

                if None not in (total, date_range) and date_range > 0:
                    date_range = max(1, min(date_range, 30))

                    daily_nonrec = (total - recurring_total) / date_range
                    projected = daily_nonrec * 30 + recurring_total

                    features = {
                        'total': total,
                        'date_range': date_range,
                        'recurring_total': recurring_total,
                        'daily_nonrec': daily_nonrec,
                        'projected_baseline': projected
                    }

                    data.append(features)
                    targets.append(projected)

            except Exception as e:
                print(f"Skipping {user} due to error: {e}")

    return pd.DataFrame(data), np.array(targets)

# Extract features
X_train_full, y_train = load_user_totals('train')
X_test_full, y_test = load_user_totals('test')

# Drop projected baseline before training
X_train = X_train_full.drop(columns=['projected_baseline'])
X_test = X_test_full.drop(columns=['projected_baseline'])

# Train model
print(f"Training on {len(X_train)} users.\n") # with features: {list(X_train.columns)}")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
train_preds = model.predict(X_train)

print("Training Complete.")
train_mae = mean_absolute_error(y_train, train_preds)
train_acc = 1 - (train_mae / np.mean(y_train))
print(f"Training MAE: {train_mae:.2f}")
print(f"Training Accuracy: {train_acc * 100:.2f}%")

# Test model
print(f"\nTesting on {len(X_test)} users.")
test_preds = model.predict(X_test)
test_mae = mean_absolute_error(y_test, test_preds)
test_acc = 1 - (test_mae / np.mean(y_test))

print("\nFinal Evaluation on Test Set")
print(f"Test MAE: {test_mae:.2f}")
print(f"Test Accuracy: {test_acc * 100:.2f}%")

print("\nPer-user predictions:")
for i in range(len(y_test)):
    print(f"User {i+1:3}: Predicted = {test_preds[i]:9.2f} | Actual = {y_test[i]:9.2f} | Error = {abs(test_preds[i] - y_test[i]):7.2f}")


# In[4]:


# Save trained model
with open('random_forest_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Save feature names
with open('model_features.pkl', 'wb') as f:
    pickle.dump(list(X_train.columns), f)

print("📦 Model and feature list saved using pickle.")

