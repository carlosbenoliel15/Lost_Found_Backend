import React from 'react';
import styled from 'styled-components';
import myIcon from './myIcon.png';

const CardContainer = styled.div`
  width: 603px;
  height: auto;
  background: #FFF;
  border-radius: 20px 0 0 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
`;

const MainIcon = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 20px;
`;

const GreyBox = styled.div`
  width: 482.14px;
  height: 476.04px;
  background-color: #ECECEC;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const WalletsLabel = styled.div`
  width: 155.3px;
  font-family: Roboto;
  font-size: 32px;
  font-weight: 700;
  line-height: 37.5px;
  text-align: left;

  height: 37.15px;
  top: 20px; 
  left: -20px; 
  gap: 0px;
  border-radius: 20px 20px 20px 20px;
  opacity: 1;
  position: absolute;
  background-color: #000; 
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF; 
`;

const SmallIconsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 20px;
`;

const GreyBoxSmall = styled.div`
  width: 117.87px;
  height: 128.97px;
  background-color: #ECECEC;
  border-radius: 20px;
  margin: 0 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled.img`
  width: 50px;
  height: auto;
`;

const TitleBar = styled.div`
  width: 100%;
  background: #000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 20px 0 0 0;
  margin-bottom: 20px;
`;

function App() {
  return (
    <CardContainer>
      <TitleBar>Title</TitleBar>
      <GreyBox>
        <WalletsLabel>Wallets</WalletsLabel>
        <Icon src={myIcon} alt="Main Icon" />
      </GreyBox>
      <SmallIconsContainer>
        <GreyBoxSmall>
          <Icon src={myIcon} alt="Small Icon" />
        </GreyBoxSmall>
        <GreyBoxSmall>
          <Icon src={myIcon} alt="Small Icon" />
        </GreyBoxSmall>
        <GreyBoxSmall>
          <Icon src={myIcon} alt="Small Icon" />
        </GreyBoxSmall>
      </SmallIconsContainer>
    </CardContainer>
  );
}

export default App;
