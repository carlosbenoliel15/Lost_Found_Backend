import React, { useState } from 'react';
import './FormComponent.css'; 

const FormComponent = () => {
  const [nic, setNic] = useState('');
  const [email, setEmail] = useState('');

  const handleNicChange = (event) => {
    setNic(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <div className="form-container">
      <div className="input-group">
        <div className="label-container">
          <label htmlFor="nic">NIC</label>
        </div>
        <input
          type="text"
          id="nic"
          className="input-field"
          value={nic}
          onChange={handleNicChange}
          placeholder="Insert title of lost object"
        />
      </div>
      <div className="input-group">
        <div className="label-container">
          <label htmlFor="email">Email</label>
        </div>
        <input
          type="email"
          id="email"
          className="input-field"
          value={email}
          onChange={handleEmailChange}
          placeholder="Insert title of lost object"
        />
      </div>
    </div>
  );
};

export default FormComponent;