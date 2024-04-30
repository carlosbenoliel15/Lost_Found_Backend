import React, { useState } from 'react';
import EYE from '../imgs/eye.png';
import SLASHEYE from '../imgs/slasheye.png';


const PasswordInput = ({ onPasswordChange }) => {

    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [password, setPassword] = useState('');

    const togglePasswordVisiblity = () => {
        setIsPasswordShown(!isPasswordShown);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (onPasswordChange) {
            onPasswordChange(e.target.value);
        }
    };
    return (
        <div className='relative mb-3'>
            <input type={isPasswordShown ? 'text' : 'password'} onChange={handlePasswordChange} value={password} className='bg-transparent border-b-2 w-full border-white pr-10'></input>
            <img className='cursor-pointer absolute right-[1px] top-[0] max-w-[20px]' src={isPasswordShown ? SLASHEYE : EYE} alt='Ojo eye' onClick={togglePasswordVisiblity}></img>
        </div>
    )
}

export default PasswordInput