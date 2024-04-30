import React from 'react';
import ICONLOGIN from '../imgs/logo-projeto 1.png';
import TEXTICON from '../imgs/BidReclaim.png';
import Input from './Input';
import Button from './Button';
import GOOGLELOGO from '../imgs/googlelogo.png';
import RECTANGLE1 from '../imgs/Rectangle 1.png';
import RECTANGLE2 from '../imgs/Rectangle 2.png';
import RECTANGLE3 from '../imgs/Rectangle 3.png';
import RECTANGLE4 from '../imgs/Rectangle 4.png';
import PasswordInput from './PasswordInput';



const LoginPage = () => {
    return (
        <div className='p-20 flex justify-between items-center flex-col h-screen mobile:w-[390px]'>
            <div className='bg-loginBg w-loginWidth min-h-loginHeight rounded-2xl p-20 flex justify-between relative'>
                {/* Left login page */}
                <div className='w-1/2 flex flex-col gap-8 items-start'>
                    {/* Img container */}
                    <div className='mb-20'>
                        <img className='absolute top-[-20px] left-40' src={ICONLOGIN} alt='icon login'></img>
                        <img className='absolute' src={TEXTICON} alt='text BidReclaim'></img>
                    </div>
                    {/* Form */}
                    <form className='flex flex-col items-center gap-8'>
                        <div className='flex flex-col w-[291px]'>
                            <label className='text-lg text-white font-bold' htmlFor='email'>Utilizador</label>
                            <Input inputType={'email'} inputName={'email'} />
                        </div>
                        <div className='flex flex-col w-[291px]'>
                            <label className='text-lg text-white font-bold' htmlFor='pass'>Password</label>
                            <PasswordInput />
                        </div>
                        <Button btnClassName={'w-btnLogin h-btnLogin rounded-btnRadius bg-btnLogin text-white text-[20px] font-bold'} btnText={'Entrar'} />
                        <Button imgClassName={'w-8 mr-6'} btnImg={GOOGLELOGO} btnClassName={'border border-neutral-950 flex items-center font-bold pl-6 w-[291px] h-btnLogin rounded-btnRadius bg-white'} btnText={'Entrar con Google'} />
                        <a className='text-white underline font-bold' href=''>Esquecl-me da password</a>
                    </form>
                </div>
                <div className='w-[2px] h-[458px] bg-white'></div>
                <div className='w-1/2 flex flex-col justify-start items-center gap-8'>
                    <div className='flex flex-wrap gap-2 w-full justify-center items-start'>
                        <img src={RECTANGLE1} alt={'Img rectangle'}></img>
                        <img src={RECTANGLE2} alt={'Img rectangle'}></img>
                        <img src={RECTANGLE3} alt={'Img rectangle'}></img>
                        <img className='relative bottom-4' src={RECTANGLE4} alt={'Img rectangle'}></img>
                    </div>
                    <Button btnClassName={'w-btnRegisterConta h-btnLogin rounded-btnRadius bg-btnLogin text-white text-[20px] font-bold'} btnText={'Registrar Conta'} />
                </div>
            </div>
            <div>
                <div className='w-[1151px] h-[1px] bg-[#303E71]'></div>
                <div className='flex items-center justify-between w-[1151px] mt-4'>
                    <p className='text-[#303E71]'>© Copyright 2021, All rights Reserved</p>
                    <div className='flex gap-4'>
                        <a className='text-[#303E71]' href=''>Políticas de privacidade</a>
                        <a className='text-[#303E71]' href=''>Termos e condições</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage