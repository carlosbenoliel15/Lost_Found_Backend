import React, { useState } from 'react';
import styled from 'styled-components';
import icon from './icon.png'; 

const LocationFormContainer = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const InputField = styled.input`
  width: 96%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 20px;
  border: 1px solid #ccc;
  background-color: #ECECEC; 
`;

const MapContainer = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 20px;
  border: 1px solid #ccc;
  margin: 10px 0;
  position: relative;
  background-color: #ECECEC;
`;

const InstructionText = styled.p`
  color: #3CB684; 
  font-size: 1rem; 
  margin-top: 0.5rem;
`;

const MapIcon = styled.div`
  background-image: url(${icon});
  background-size: cover;
  background-position: center; 
  width: 50px;
  height: 50px; 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const InputLabel = styled.label`
  position: absolute;
  top: -10px; 
  left: 20px; 
  background-color: #3CB684; 
  color: white; 
  padding: 5px 10px; 
  border-radius: 10px;
  font-size: 0.8rem;
  user-select: none; 
`;

const InputContainer = styled.div`
  position: relative;
  margin-bottom: 20px; 
`;

const LocationForm = () => {
  const [location, setLocation] = useState('');
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <LocationFormContainer>
      <FormTitle>Where did you lose it?</FormTitle>
      <InstructionText>Insert the location. If you don't know, please choose the 'I have no clue' option.</InstructionText>
      <InputContainer>
        <InputLabel>Location</InputLabel> 
        <InputField
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="   Insert the name of the street, neighbourhood or city where you lost your object"
        />
  </InputContainer>
      <InstructionText>Or use the map to mark it.</InstructionText>
      <MapContainer>
        <MapIcon>
        </MapIcon>
      </MapContainer>
    </LocationFormContainer>
  );
};

export default LocationForm;