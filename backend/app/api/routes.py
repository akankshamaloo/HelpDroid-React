from flask import request, jsonify
from app.db.mongo import *
from app.db.authentication import *
from app.features.otp_generate import *
from werkzeug.utils import secure_filename
import os

def setup_routes(app):
    # Set the folder where uploaded files will be stored
    app.config['UPLOAD_FOLDER'] = r'C:\Users\akank'
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Optional: Set a limit to the upload size

    # Ensure the upload directory exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    @app.route('/register', methods=['POST'])
    def register():
        # Extract data from the request
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        mobile = data.get('mobile')
        role = data.get('role')
        print(data)
        print(email, password, name, mobile, role)
        # Check if all required fields are present
        # if not (email and password and name and mobile and role):
        #     return jsonify({'data': 'Missing required fields'}), 400


        success,user_id = reg_auth(email, password, name, mobile, role)

        # Check if registration/authentication was successful
        if success:
            return jsonify({'data': 'Registration successful', 'user_id': str(user_id)}), 200
        else:
            return jsonify({'data': 'Registration failed'}), 400


    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'data': 'Missing email or password'}), 400

        try:
            # Assume loginotpcheck fetches the user and checks the password
            result, user_id, role = login_auth(email,password)
            print(result, user_id, role)
            if result:
                # This is just a simple implementation, password checking logic should be added
                return jsonify({'data': 'Login successful', 'user_id': user_id, 'role':role}), 200
            else:
                return jsonify({'data': 'Invalid login credentials'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500
        
    @app.route('/send-otp', methods=['POST'])
    def send_otp():
        email = request.json.get('email')
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        otp = generate_otp()
        try:
            send_mail(email, f'Your OTP for HelpDroid is: {otp}')
            return jsonify({'success': True, 'message': 'OTP sent successfully','recived_otp': otp}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
        
    @app.route('/forgot-password', methods=['POST'])
    def forgot_password():
        email = request.json.get('email')
        password = request.json.get('password')
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400       
        try:
            update(email,password)
            print(email,password)
            return jsonify({'success': True, 'message': 'Password successfully'}), 200
        except Exception as e:
            return jsonify({'success': False, 'message': str(e)}), 500
        
    @app.route('/upload-prescription', methods=['POST'])
    def upload_prescription():
        email = request.form['email']  # Access email sent from the form
        file = request.files['file']  # Access the file sent from the form
        print(email, file)
        
        if not email or not file:
            return jsonify({'data': 'Missing required fields'}), 400
        
        if file and email:
            filename = secure_filename(file.filename)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            print(save_path)
            file.save(save_path)  # Save file to the uploads folder

        try:
            # Get the size of the file in kilobytes (KB)
            file_size_kb = os.path.getsize(save_path) / 1024

            # Check if the file size is less than or equal to 300 KB
            if file_size_kb > 300:
                os.remove(save_path)  # Clean up the temporary file
                return jsonify({'data': 'Choose a file within 300 KB'}), 400

            # If file size is acceptable, proceed with encryption and updating the database
           
            append_encrypted_image_to_prescription(save_path, email)

            os.remove(save_path)  # Clean up the temporary file
            return jsonify({'data': 'Prescription uploaded successfully'}), 200

        except Exception as e:
            os.remove(save_path)  # Ensure to clean up the temporary file in case of an error
            return jsonify({'data': str(e)}), 500
    

    @app.route('/get-prescription', methods=['POST'])
    def get_prescription():
        email = request.json.get('email')
        if not email:
            return jsonify({'data': 'Missing required fields'}), 400

        try:
            data = fetch_and_decrypt_prescription_images(email)
            return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'data': str(e)}), 500


    @app.route('/upload-medication', methods=['POST'])
    def upload_medication():
        data=request.get_json()
        email=data.get('email')
        days=data.get('days')
        time=data.get('time')
        medicine=data.get('medicine')
        print(data)
        if not all([email,days,time,medicine]):
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            success=insert_medication(email,days,time,medicine)
            if success:
                return jsonify({'data': 'Medication uploaded successfully'}), 200
            else:
                return jsonify({'data': 'Medication upload failed'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500
        
    @app.route('/get-medication', methods=['POST'])
    def get_medication():
        email=request.json.get('email')
        if not email:
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            data=get_medications_details(email)
            return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'data': str(e)}), 500
    
    @app.route('/remove-medication', methods=['POST'])
    def remove_medication():
        print(request.json)
        email=request.json.get('email')
        medication=request.json.get('medication')
        if not all([email,medication]):
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            success=delete_medication(email,medication)
            if success:
                return jsonify({'data': 'Medication deleted successfully'}), 200
            else:
                return jsonify({'data': 'Medication delete failed'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500
    
    @app.route('/edit-medication', methods=['POST'])
    def edit_medication():
        print(request.json)
        email=request.json.get('email')
        medication=request.json.get('medication')
        days=request.json.get('days')
        time=request.json.get('time')
        if not all([email,medication,days,time]):
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            success=update_medication(email,medication,days,time)
            if success:
                return jsonify({'data': 'Medication updated successfully'}), 200
            else:
                return jsonify({'data': 'Medication update failed'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500
        
    @app.route('/user-statistics', methods=['POST'])
    def user_statistics():
        email = request.json.get('email')
        if not email:
            return jsonify({'data': 'Missing required fields'}), 400

        try:
            prescription_count, medicine_count, chat_count = get_user_statistics(email)
            return jsonify({'prescription_count': prescription_count, 'medicine_count': medicine_count, 'chat_count': chat_count}), 200
        except Exception as e:
            return jsonify({'data': str(e)}), 500
        
    @app.route('/upload-contacts', methods=['POST'])
    def upload_contacts():
        data=request.get_json()
        email=data.get('email')
        email1=data.get('email1')
        pname=data.get('name')
        mobile=data.get('mobile')
        print(data)
        if not all([email,email1,pname,mobile]):
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            success=insert_contact(email,email1,pname,mobile)
            if success:
                return jsonify({'data': 'Contact uploaded successfully'}), 200
            else:
                return jsonify({'data': 'Contact upload failed'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500
    
    @app.route('/get-contacts', methods=['POST'])
    def get_contacts():
        email=request.json.get('email')
        if not email:
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            data=fetch_contacts(email)
            print(data)
            return jsonify({'data': data}), 200
        except Exception as e:
            return jsonify({'data': str(e)}), 500

    @app.route('/edit-contacts', methods=['POST'])
    def edit_contacts():
        data=request.get_json()
        email=data.get('email')
        email1=data.get('email1')
        pname=data.get('name')
        mobile=data.get('mobile')
        print(data)
        if not all([email,email1,pname,mobile]):
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            success=update_contact(email,email1,pname,mobile)
            if success:
                return jsonify({'data': 'Contact updated successfully'}), 200
            else:
                return jsonify({'data': 'Contact update failed'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500
        
    @app.route('/remove-contacts', methods=['POST'])
    def remove_contacts():
        data=request.get_json()
        email=data.get('email')
        pname=data.get('name')
        print(data)

        if not all([email,pname]):
            return jsonify({'data': 'Missing required fields'}), 400
        try:
            success=delete_contact(email,pname)
            if success:
                return jsonify({'data': 'Contact deleted successfully'}), 200
            else:
                return jsonify({'data': 'Contact delete failed'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500