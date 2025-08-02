"use client"

import Button from '@/src/components/elements/buttons/button';
import './homepage.css';
import Link from 'next/link';
import LinkSection from './linksSection';

export default function HomePage() {

    const heroTexts = [
        {
            description: `A mudança é necessária para evoluir, de forma convicta e objetiva.
Assim como você, buscamos a nossa.`
        }
    ];


    function handleButtonClick() {
        alert("Button clicked! Redirecting to the next page...");
    }



    return (
        <>
            <div className="w-full flex items-center justify-center heroHeight ">
                <div className="h-full w-1/2 ">
                    <div className='h-full w-full flex flex-col justify-center px-20 gap-8'>

                        <div className='flex gap-2'>
                            <img src="./link.png" alt="link Icon" className='w-8 h-8 object-cover' />
                            <h1 className='text-3xl font-bold text-color uppercase'>Desafie.
                                <span className='primary-color'> Conecte.</span> Transforme.</h1>
                        </div>


                        <p className='text-color flex text-2xl '>{heroTexts[0].description}</p>

                        <div className='flex gap-4 items-center '>
                            <Button label="Acessar" onClick={() => { handleButtonClick() }} />
                            <Link className='text-lg cursor-pointer' href='/about'>Conheça-nos</Link>
                        </div>
                    </div>
                </div>


                <div className="h-full w-1/2">
                    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                        <img src="./effect.png" alt="Effect" className='absolute h-2/3 top-10/12 right-0' />

                        <div className="flex flex-col items-center gap-4">
                            <p className="text-4xl font-bold secondary-color">RE</p>
                            <img src="./home/card1.png" alt="Company Card" className="object-contain h-72 card-drop" />
                        </div>


                        <div className="flex flex-col items-center gap-4">
                            <img src="./home/card2.png" alt="Company Card" className="object-contain h-72 card-drop" />
                            <p className="text-4xl font-bold secondary-color">IMAGINE</p>
                        </div>
                    </div>
                </div>
            </div>

            <LinkSection />
        </>
    );
}