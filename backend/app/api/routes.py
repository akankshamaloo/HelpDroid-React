from flask import request, jsonify
from app.db.mongo import *
from app.db.authentication import *
from app.features.otp_generate import *

def setup_routes(app):

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

    @app.route('/submit-otp', methods=['POST'])
    def submit_otp():
        otp = request.json.get('otp')
        expected_otp = request.json.get('expected_otp')  # Assuming the expected OTP is sent in the request
        
        if not otp or not expected_otp:
            return jsonify({'success': False, 'message': 'OTP is required'}), 400
        
        if otp == expected_otp:
            return jsonify({'success': True, 'message': 'OTP verified successfully'}), 200
        else:
            return jsonify({'success': False, 'message': 'Invalid OTP'}), 401
    