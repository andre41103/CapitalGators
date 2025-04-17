#!/usr/bin/env python
# coding: utf-8

import os
import json
from azure.core.credentials import AzureKeyCredential
from azure.ai.documentintelligence import DocumentIntelligenceClient
from PIL import Image
from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')
categories = [
"Food & Dining",
"Housing & Utilities",
"Transportation",
"Leisure",
"Personal Care & Education"
]
category_embeddings = model.encode(categories, convert_to_tensor=True)

def get_closest_category(merchant_name):
    if not merchant_name:
        return "Uncategorized"
    merchant_embedding = model.encode(merchant_name, convert_to_tensor=True)
    similarities = util.cos_sim(merchant_embedding, category_embeddings)
    best_match_index = similarities.argmax().item()
    return categories[best_match_index]

def analyze_receipt(image_path):
    
    endpoint = "https://resourceforimages.cognitiveservices.azure.com/"
    key = "FcpM8ICO9uWjpqUZjGMjcgu3TcBg363FsUTF2LhpObr4SAfJa3ngJQQJ99BCACYeBjFXJ3w3AAALACOGgWZc"

    try:
        document_intelligence_client = DocumentIntelligenceClient(
            endpoint=endpoint, credential=AzureKeyCredential(key)
        )
    except Exception as e:
        return

    def get_field_value(field, field_type="string"):
        if field:
            if field_type == "string":
                return field.value_string if field.value_string else None
            elif field_type == "date":
                return field.value_date.strftime("%Y-%m-%d") if field.value_date else None
            elif field_type == "currency":
                return field.value_currency.amount if field.value_currency else None
            elif field_type == "number":
                return field.value_number if field.value_number else None
        return None

    # Resize if necessary
    def resize_image(image_path, max_size=(800, 800), max_quality=85):
        with Image.open(image_path) as img:
            img.thumbnail(max_size)
            resized_image_path = os.path.splitext(image_path)[0] + "_resized.jpg"
            img.save(resized_image_path, "JPEG", quality=max_quality)
        return resized_image_path

    # Resize if image is too large
    try:
        if os.path.getsize(image_path) > 4 * 1024 * 1024:
            image_path = resize_image(image_path)

    except Exception as e:
        return

    try:
        with open(image_path, "rb") as receipt_file:
            poller = document_intelligence_client.begin_analyze_document("prebuilt-receipt", receipt_file)
            receipts = poller.result()
    except Exception as e:
        return

    cleaned_data = []

    # Check if documents were found
    if not receipts.documents:
        return

    # Process data and clean it for output
    for idx, receipt in enumerate(receipts.documents):
        receipt_info = {
            "merchant_name": get_field_value(receipt.fields.get("MerchantName")),
            "receipt_type": get_closest_category(get_field_value(receipt.fields.get("MerchantName"))),
            "total": get_field_value(receipt.fields.get("Total"), "currency"),
            "date": get_field_value(receipt.fields.get("TransactionDate"), "date"),
            "notes": "",
            "recurring": False
        }

        cleaned_data.append(receipt_info)

    # Final cleaned data (as JSON)
    print(json.dumps(cleaned_data))


# Example usage
analyze_receipt("uploaded_receipt.jpg")
