import React from 'react';
import styled from 'styled-components';

const DescriptionBox = styled.div`
  width: 1188px;
  height: 274px;
  position: absolute;
  top: 74px;
  left: 26px;
  border-radius: 20px; 
  background: #FFFFFF;
  border: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
`;

const DescriptionText = styled.p`
  margin: 0; 
`;

const DescriptionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

const DescriptionComponent = () => {
  return (
    <DescriptionBox>
      <DescriptionTitle>Description</DescriptionTitle>
      <DescriptionText>Black Mont Blanc leather wallet exudes elegance with its sleek design and iconic emblem. Crafted for durability and style, it offers practical organization for essentials.</DescriptionText>
      <ul>
        <li>iofiuory</li>
        <li>eufyruieyf</li>
      </ul>
    </DescriptionBox>
  );
};

export default DescriptionComponent;