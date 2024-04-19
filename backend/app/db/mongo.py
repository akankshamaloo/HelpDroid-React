import pymongo
from pymongo import MongoClient
from hashlib import sha256
import os

# Replace with your MongoDB connection string
mongo_uri = 'mongodb+srv://sonadas8april:riyadasdas@cluster0.x0jnn5h.mongodb.net/'

# Create a MongoClient
client = pymongo.MongoClient(mongo_uri)

# Replace with your database name
db = client['HelpDroid']

# Replace with your collection name
collection = db['User']

def insert_data(email, password, mobile, name, role):
    try:
        # Hash password and email for storage
        hashed_password = sha256((password + email).encode()).hexdigest()
        
        data = {
            'email': email,
            'password': hashed_password,
            'mobile': mobile,
            'name': name,
            'role': role
        }
        collection.insert_one(data)
        print("Inserted")
    except Exception as e:
        print(f"Error: {e} (An error occurred)")

def update(email_input, new_pass):
    filter_criteria = {"email": email_input}
    update_operation = {"$set": {"password": sha256(new_pass.encode()).hexdigest()}}
    collection.update_one(filter_criteria, update_operation)
    print("Updated")

def find(query):
   return list(collection.find(query))

def loginotpcheck(email_input):
    query = {'email': email_input}
    matching_documents = collection.find(query)
    for document in matching_documents:
        print("Login Successful")
        role = document['role']
        id = str(document['_id'])
        if role:
            return "Doctor", id
        else:
            return "Patient", id
    return None, None