import React, { useState } from 'react';
import './App.css';
import logo from './verde.png'; 
import switchToggle from './Switch_toggle.png'; 

import teste1 from './teste 1.png';
import teste2 from './teste 2.png';
import teste3 from './teste 3.png';
import teste4 from './teste 4.png';
function MenuOptions({ onSelect }) {
  const handleClick = (option) => {
    onSelect(option);
  };

  return (
    <div className="menu-options">
      <button className="menu-option" onClick={() => handleClick('WALLETS')}>• WALLETS</button>
      <button className="menu-option" onClick={() => handleClick('CAR KEYS')}>• CAR KEYS</button>
      <button className="menu-option" onClick={() => handleClick('HANDBAGS')}>• HANDBAGS</button>
      <button className="menu-option" onClick={() => handleClick('BACKPACKS')}>• BACKPACKS</button>
      <button className="menu-option" onClick={() => handleClick('BICYCLES')}>• BICYCLES</button>
      <button className="menu-option" onClick={() => handleClick('JACKETS')}>• JACKETS</button>
      <button className="menu-option" onClick={() => handleClick('WATCHES')}>• WATCHES</button>
    </div>
  );
}


function App() {
  const [selectedOption, setSelectedOption] = useState('WALLETS');

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="App">
      <Navbar />
      <MenuOptions onSelect={handleSelect} />
      {selectedOption === 'WALLETS' && (
        <WalletList />
      )}
      {selectedOption === 'WALLETS' || (
        <div className="warning">
          Falta implementar la opción: <strong>{selectedOption}</strong>
        </div>
      )}
    </div>
  );
}




const walletData = [
    { id: 1, name: 'MONT BLANC WALLET', price: '', image: teste1 },
    { id: 2, name: 'BILLABONG WALLET', price: '', image: teste2 },
    { id: 3, name: 'BLACK WALLET', price: '', image: teste3 },
    { id: 4, name: 'JUST WALLET', price: '', image: teste4 },
    { id: 5, name: 'MONT BLANC WALLET', price: '', image: teste1 },
    { id: 6, name: 'BILLABONG WALLET', price: '', image: teste2 },
    { id: 7, name: 'BLACK WALLET', price: '', image: teste3 },
    { id: 8, name: 'JUST WALLET', price: '', image: teste4 },
    { id: 9, name: 'MONT BLANC WALLET', price: '', image: teste1 },
    { id: 10, name: 'BILLABONG WALLET', price: '', image: teste2 },
    { id: 11, name: 'BLACK WALLET', price: '', image: teste3 },
    { id: 12, name: 'JUST WALLET', price: '', image: teste4 },
  // ...
];



function WalletList() {

  const walletImages = [teste1, teste2, teste3, teste4];
  const wallets = new Array(12).fill(null).map((_, index) => ({
    id: index,
    name: `Wallet Name ${index + 1}`,
    price: '20,00 €', 
    image: walletImages[index % walletImages.length]
  }));

  return (
    <div className="wallet-list">
      {walletData.map((wallet) => (
        <div key={wallet.id} className="wallet-item">
          <img src={wallet.image} alt={wallet.name} className="wallet-image" />
          <div className="wallet-info">
            <h3 className="wallet-name">{wallet.name}</h3>
            <div className="real-leather">Real Lether</div> {/* Asegúrate de que este div esté justo debajo del título */}
            <p className="wallet-price">{wallet.price}</p>
            <button className="view-auction-button">VIEW AUCTION</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Navbar({ toggleMenu }) {
  return (
    <div className="navbar">
      <img src={logo} alt="BIDFIND.er Logo" className="navbar-logo" />
      <div className="navbar-controls">
        {/* El botón de alternancia para el menú */}
        <img src={switchToggle} alt="Toggle" className="navbar-switch-toggle" onClick={toggleMenu} />
        {/* El botón para "SIGN IN" */}
        <button className="sign-in-button">SIGN IN ⮕</button>
        {/* El botón para expandir el menú "MENU +" */}
        <button className="menu-button" onClick={toggleMenu}>MENU +</button>
      </div>
    </div>
  );
}


// Componente para el overlay del menú
function MenuOverlay() {

  return (
    <div className="menu-overlay">
      {/* Contenido del menú */}
    </div>
  );
}

export default App;
