import pymongo
import app.crypto.sha256 as sha256
import os
import json
import tempfile
from app.crypto.triple_des import decrypted, encrypted
from app.features.notification import *
from datetime import datetime
from bson.objectid import ObjectId
import base64
from pymongo import ReturnDocument


# Replace with your MongoDB connection string
mongo_uri = 'mongodb+srv://sonadas8april:riyadasdas@cluster0.x0jnn5h.mongodb.net/'

# Create a MongoClient
client = pymongo.MongoClient(mongo_uri)

# Replace with your database name
db = client['HelpDroid']

# Replace with your collection name
collection = db['User']

# Insert a document into the collection

def insert_data(email,password,mobile,name,role):
    # data = {'email': email, 'password': password,'mobile':mobile, 'name': name}
    # collection.insert_one(data)
    try:        
        hash = sha256.sha256(password+""+email)        
        data = {'email': email, 'password': hash,'mobile':mobile, 'name': name, 'role':role}
        print(data)
        id=collection.insert_one(data)
        print("Inserted")
        print(id)
        return id.inserted_id
    except Exception as e:
        print(f"Error:  (An error occurred)")

    # query = {'email': "Jlhn@john"}
def update(email_input,new_pass):
    filter_criteria = {"email": email_input}

    # Define the update operation (e.g., set a new value for a field)
    new_pass = sha256.sha256(new_pass+""+email_input)
    update_operation = {"$set": {"password": new_pass}}

    # Update the document in the collection
    collection.update_one(filter_criteria, update_operation)

    
def find(query):
   matching_documents = collection.find(query)
   return matching_documents
   
       
# def loginotpcheck(email_input):
#     query = {'email': email_input}
#     matching_documents = collection.find(query)
#     for document in matching_documents:
#         print("Login Successful")
#         role=(document['role'])
#         id=str(document['_id'])
#         if(role):
#             return "Doctor",id
#         else:
#             return "Patient",id

#     return None,None


def append_encrypted_image_to_prescription(path,email):
    # Encrypt the image data
    
    email = email
    encrypted_image = encrypted(path)

    result = collection.update_one(
        {"email": email},
        {"$push": {"prescription_images": encrypted_image}}
    )

    # Check if the update was successful
    if result.modified_count > 0:
        print(f"Image appended to prescription for {email}")
    else:
        print(f"No document found with email {email} or no update was needed.")

                
def fetch_and_decrypt_prescription_images(email):
    # Fetch the document for the given email
    document = collection.find_one({"email": email})

    # Check if the document was found
    if document:
        encrypted_images = document.get("prescription_images", [])

        decrypted_images = []
        for encrypted_image in encrypted_images:
            image_bytes = decrypted(encrypted_image)  # This function should decrypt the image
            base64_encoded = base64.b64encode(image_bytes).decode('utf-8')
            decrypted_images.append(base64_encoded)


        return decrypted_images
    
    
    else:
        print(f"No document found with email {email}")
        return []
    
def delete_prescription_image(email, index):
    document = collection.find_one({"email": email})

    if document:
        encrypted_images = document.get("prescription_images", [])

        if 0 <= index < len(encrypted_images):
            del encrypted_images[index]
            result = collection.update_one(
                {"email": email},
                {"$set": {"prescription_images": encrypted_images}}
            )
            if result.modified_count > 0:
                print(f"Prescription image deleted for {email}")
                return True
    return False
    
def insert_medication(email,days,med_time,med_name):
    if not email:
        print("No email found in session.")
        return

    med_data = {"name": med_name, "time": med_time, "days": days}
    print(med_data)
    try:
        # Update the existing user document to add the contact
        update_result = collection.update_one(
            {"email": email},
            {"$push": {"medication": med_data}},
            upsert=False
        )
        
        if update_result.modified_count > 0:
            print("medication inserted successfully.")
            datetime_obj = datetime.fromisoformat(med_time)
            time_formatted = datetime_obj.strftime('%H:%M')
            print(time_formatted)
            schedule_medication_notification(med_name, time_formatted, days)
            return True
        else:
            print("No update was made.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False
    

def get_medications_details(email):
    # Replace with your collection name
    user_data = collection.find_one({"email": email})
    if user_data and "medication" in user_data:
        return user_data["medication"]
    return []
def delete_medication(email,med_name):
    if not email:
        print("No email found in session.")
        return

    if med_name is None :
        return

    med_data = {"name": med_name}

    try:
        # Update the existing user document to add the contact
        update_result = collection.update_one(
            {"email": email},
            {"$pull": {"medication": med_data}},
            upsert=False
        )
        
        
        if update_result.modified_count > 0:
            print("medication deleted successfully.")
            return True
        else:
            print("delete was not made, possibly because the medication does not exist.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False
    
def update_medication(email, med_name, days, med_time):
    if not email:
        print("No email found in session.")
        return

    if not med_name:
        print("No medication name provided.")
        return

    try:
        # Update the existing user document to update the medication
        update_result = collection.update_one(
            {"email": email, "medication.name": med_name},
            {"$set": {"medication.$.days": days, "medication.$.time": med_time}},
            upsert=False
        )

        if update_result.modified_count > 0:
            print("Medication updated successfully.")
            datetime_obj = datetime.fromisoformat(med_time)
            time_formatted = datetime_obj.strftime('%H:%M')
            print(time_formatted)
            schedule_medication_notification(med_name, time_formatted, days)
            # You may want to call a function here to update the medication schedule notification
            return True
        else:
            print("No update was made. Possibly because the medication name was not found.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False
    

def get_user_statistics(email):
    # Initialize counters
    prescription_count = 0
    medicine_count = 0
    unique_receiver_ids = set()

    try:
        # Retrieve the user document by email
        user_document = collection.find_one({"email": email})

        # Check if the document was found
        if user_document:
            # Count the number of prescriptions
            if "prescription_images" in user_document:
                prescription_count = len(user_document["prescription_images"])

            # Count the number of medicines
            if "medication" in user_document:
                medicine_count = len(user_document["medication"])

            # Count the number of unique receiver IDs for chats
            if "messages" in user_document:
                # Iterate over each message group
                for message_group in user_document["messages"]:
                    # Extract unique receiver IDs from the messages
                    unique_receiver_ids.update([message_group["receiver_id"]])

        # Return the counts
        return prescription_count, medicine_count, len(unique_receiver_ids)

    except Exception as e:
        print(f"An error occurred: {e}")
        return 0, 0, 0  # Return zeros in case of any error 

def read_email_from_session():
    with open('session.json', 'r') as file:
        session_data = json.load(file)
        return session_data.get('user_email', None)

def read_id_from_session():
    with open('session.json', 'r') as file:
        session_data = json.load(file)
        return session_data.get('user_id', None)
    
def read_role_from_session():
    with open('session.json', 'r') as file:
        session_data = json.load(file)
        return session_data.get('role', None)

def insert_contact(email,email1=None, name='user', mobile=None):
    
    if not email:
        print("No email found in session.")
        return
    
    if email1 is None:
        return
    if mobile is None:
        return
    
    contact_data = {"name": name, "email": email1, "mobile": mobile}
    print(contact_data)
    try:
        print(contact_data)
        # Update the existing user document to add the contact
        update_result = collection.update_one(
            {"email": email},
            {"$push": {"contacts": contact_data}},
            upsert=False
        )
        if update_result.matched_count == 0:
            print("No user found with the provided email.")
            return False
        elif update_result.modified_count > 0:
            print("Contact inserted successfully.")
            return True
        else:
            print("No update was made, possibly because the contact already exists.")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

def fetch_contacts(email):
    if not email:
        print("No email found in session.")
        return

    try:
        # Fetch the user document
        user_document = collection.find_one({"email": email})

        # Check if the document was found
        if user_document:
            contacts = user_document.get("contacts", [])
            print(contacts)
            return contacts
        else:
            print(f"No document found with email {email}")
            return []

    except Exception as e:
        print(f"Error: {e}")
        return []

def delete_contact(email, name):
    if not email:
        print("No email found in session.")
        return

    if name is None:
        print("Name must be provided.")
        return

    contact_data = {"name": name}

    try:
        # Print debug information
        print("Deleting contact with email:", email)
        print("Contact data:", contact_data)

        # Perform deletion operation
        result = collection.find_one_and_update(
            {"email": email},
            {"$pull": {"contacts": contact_data}},
            return_document=ReturnDocument.AFTER
        )
        
        if result:
            print("Contact deleted successfully.")
            return True
        else:
            print("No update was made, possibly because the contact does not exist.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False
    
def update_contact(email, new_email, name, new_mobile):
    if not email:
        print("No email found in session.")
        return False

    if new_email is None or new_mobile is None:
        print("Both new_email and new_mobile must be provided.")
        return False

    contact_data = {"contacts.$.email": new_email, "contacts.$.mobile": new_mobile}

    try:
        # Print debug information
        print("Updating contact with email:", email)
        print("New email:", new_email)
        print("New name:", name)
        print("New mobile:", new_mobile)

        # Update the existing user document to update the contact
        result = collection.find_one_and_update(
            {"email": email, "contacts.name": name},
            {"$set": contact_data},
            return_document=ReturnDocument.AFTER
        )
        
        if result:
            print("Contact updated successfully.")
            return True
        else:
            print("No update was made, possibly because the contact does not exist.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False

    
def user_details(email):
    
    if not email:
        print("No email found in session.")
        return

    try:
        # Fetch the user document
        user_document = collection.find_one({"email": email})

        # Check if the document was found
        if user_document:
            return user_document
        else:
            print(f"No document found with email {email}")
            return []

    except Exception as e:
        print(f"Error: {e}")
        return []


def insert_appointment(p_name,a_time,a_date):
    email = read_email_from_session()
    if not email:
        print("No email found in session.")
        return

    if p_name is None or a_time is None or a_date is None:
        return

    a_data = {"name": p_name, "time": a_time, "date": a_date}

    try:
        # Update the existing user document to add the contact
        update_result = collection.update_one(
            {"email": email},
            {"$push": {"appointment": a_data}},
            upsert=False
        )
        
        
        if update_result.modified_count > 0:
            print("appointment inserted successfully.")
            schedule_appointment_notification(p_name, a_time, a_date)
            return True
        else:
            print("No update was made, possibly because the contact already exists.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False

def get_appointment_details():
    email = read_email_from_session()
    # Ensure your MongoDB connection/collection is correctly set up here
    user_data = collection.find_one({"email": email})
    
    if user_data and "appointment" in user_data:
        # Get current local system time
        current_time = datetime.now()
        
        updated_appointments = []
        for appointment in user_data["appointment"]:
            # Combine date and time into a datetime object for local time
            appointment_time = datetime.strptime(f"{appointment['date']} {appointment['time']}", "%Y-%m-%d %H:%M")
            
            if appointment_time >= current_time:
                updated_appointments.append(appointment)
        
        # Update the database with the remaining (future) appointments
        collection.update_one({"email": email}, {"$set": {"appointment": updated_appointments}})
        
        return updated_appointments
    return []

def delete_appointment(p_name,apt_detail):
    email = read_email_from_session()
    if not email:
        print("No email found in session.")
        return

    if p_name is None or apt_detail is None:
        return
    formatdata=apt_detail.split("(")[1].split(')')[0].replace("'","")
    time=formatdata.split(",")[0].strip()
    date=formatdata.split(",")[1].strip()
    apt_data = {"name": p_name, "time": time, "date": date}
    print(apt_data)
    try:
        # Update the existing user document to add the contact
        update_result = collection.update_one(
            {"email": email},
            {"$pull": {"appointment": apt_data}},
            upsert=False
        )
        
        
        if update_result.modified_count > 0:
            print("appointment deleted successfully.")
            return True
        else:
            print("No update was made, possibly because the contact already exists.")
            return False

    except Exception as e:
        print(f"Error: {e}")
        return False


    
def send_notification():
    try:
        med_timings = get_medications_details()
        apt_timings = get_appointment_details()
        for med_timing in med_timings:
            schedule_medication_notification(med_timing["name"], med_timing["time"])
        for apt_timing in apt_timings:
            schedule_appointment_notification(apt_timing["name"], apt_timing["time"], apt_timing["date"])
    except Exception as e:
        print("Error")


def find_by_role_true():
    # Define the query to find documents where 'role' exists and is true
    user_role=read_role_from_session()
    print(user_role)
    if not user_role :
        print("FALSE PATIENT")
        query = {"role": {"$exists": True, "$eq": True}}
        matching_documents = collection.find(query)
        print(matching_documents)
        # Format the results as a list of dictionaries containing 'name' and '_id'
        results = [{'name': doc['name'], 'id': str(doc['_id'])} for doc in matching_documents]
        print("res",results)
        return results
    else:
        print("TRUE DOCTOR")
        email=read_email_from_session()
        email_doc = collection.find_one({"email": email})
    
        
        
        # Retrieve details for each receiver ID
        receiver_ids = [item['receiver_id'] for item in email_doc['messages']]
        print(receiver_ids)
        receiver_details = []

        for receiver_id in receiver_ids:
            # Convert the string ID to ObjectId for querying
            object_id = ObjectId(receiver_id)
            receiver_doc = collection.find_one({"_id": object_id}, {"name": 1})
            
            if receiver_doc:
                receiver_details.append({
                    'name': receiver_doc['name'],
                    'id': str(receiver_doc['_id'])
                })
        print(receiver_details)
        return receiver_details

        

def append_message(receiver_id, text, is_sent):
    sender_email = read_email_from_session()
    sender_id = ObjectId(read_id_from_session())  # Convert sender ID from session to ObjectId
    receiver_id = ObjectId(receiver_id)
    timestamp = datetime.now()
    print(sender_id, receiver_id)
    # Message for the sender: marking as 'sent'
    sender_message = {'text': text, 'is_sent': is_sent, 'timestamp': timestamp}
    # Message for the receiver: marking as 'received' (is_sent = False)
    receiver_message = {'text': text, 'is_sent': False, 'timestamp': timestamp}

    # Update sender's document
    sender_result = collection.update_one(
        {'_id': sender_id, 'messages.receiver_id': receiver_id},
        {'$push': {'messages.$.messages': sender_message}}
    )
    if sender_result.modified_count == 0:
        collection.update_one(
            {'_id': sender_id},
            {'$push': {'messages': {'receiver_id': receiver_id, 'messages': [sender_message]}}}
        )
        print("New receiver_id added for sender.")

    # Update receiver's document
    receiver_result = collection.update_one(
        {'_id': receiver_id, 'messages.receiver_id': sender_id},
        {'$push': {'messages.$.messages': receiver_message}}
    )
    if receiver_result.modified_count == 0:
        collection.update_one(
            {'_id': receiver_id},
            {'$push': {'messages': {'receiver_id': sender_id, 'messages': [receiver_message]}}}
        )
        print("New sender_id added for receiver.")

def fetch_messages( receiver_id):
    # Convert receiver_id to ObjectId if it's stored as such in the database
    email = read_email_from_session()
    # Fetch the user document by email
    try:
        # Convert receiver_id to ObjectId if it's stored as such in the database
        receiver_oid = ObjectId(receiver_id)

        # Execute a query to fetch the messages directly
        user_doc = collection.find_one(
            {'email': email, 'messages.receiver_id': receiver_oid},
            {'messages.$': 1}  # Project only the matching messages subdocument
        )

        if not user_doc or 'messages' not in user_doc:
            print("No messages found or no user found with that email.")
            return []

        # Return the first matching group of messages (since $elemMatch or $ projects the first match only)
        messages_list = user_doc['messages'][0]['messages']  # Extracting the nested 'messages' from the matched group
        return messages_list

    except Exception as e:
        print(f"An error occurred: {e}")
        return []  # Return an empty list or appropriate