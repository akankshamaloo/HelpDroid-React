from flask import request, jsonify
from app.db.mongo import insert_data, loginotpcheck

def setup_routes(app):

    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        mobile = data.get('mobile')
        name = data.get('name')
        role = data.get('role', False)  # Assuming role is optional and defaults to False (e.g., regular user)

        if not all([email, password, mobile, name]):
            return jsonify({'data': 'Missing required parameters'}), 400

        try:
            insert_data(email, password, mobile, name, role)
            return jsonify({'data': 'User registered successfully'}), 200
        except Exception as e:
            return jsonify({'data': str(e)}), 500

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'data': 'Missing email or password'}), 400

        try:
            # Assume loginotpcheck fetches the user and checks the password
            result, user_id = loginotpcheck(email)
            if result:
                # This is just a simple implementation, password checking logic should be added
                return jsonify({'data': 'Login successful', 'user_id': user_id}), 200
            else:
                return jsonify({'data': 'Invalid login credentials'}), 401
        except Exception as e:
            return jsonify({'data': str(e)}), 500