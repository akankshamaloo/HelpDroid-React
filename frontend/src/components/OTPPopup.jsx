import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OTPPopup = ({ isOpen, onClose, onSubmit }) => {
    const [otp, setOTP] = useState('');

    const handleOTPChange = (e) => {
        setOTP(e.target.value);
    };

    const handleSubmit = () => {
        if (otp.length !== 4 || !/^\d+$/.test(otp)) {
            toast.error('Please enter a valid 4-digit OTP.');
            return;
        }
        onSubmit(otp);
        setOTP('');
    };

    return (
        <div className={`popup ${isOpen ? 'open' : ''}`}>
            <div className="popup-inner">
                <h2>Enter OTP</h2>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOTPChange}
                />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};

export default OTPPopup;
