import './aboutpage.css'
import Beneficios from './beneficios';

export default function SobrePage() {
    return (
        <>
            <div className='bannerheight w-full flex flex-col items-center justify-center gap-10'>

                <img src="./about/sobre.jpg" alt="Reunião" className='h-5/6 rounded-3xl ' />
                <h1 className='text-4xl font-bold uppercase text-center text-color'>
                    <span className='primary-color'>D</span>iferente. <span className='primary-color'>C</span>riativa. <span className='primary-color'>E</span>stratégica
                </h1>
            </div>

            <Beneficios />

            <div className='w-full h-auto flex flex-col items-center justify-center gap-8 py-6 pb-12 '>
                <h1 className='text-4xl font-bold uppercase text-center text-color'>
                    THE <span className='primary-color'>DAE</span>
                </h1>

                <img src="./about/dae.jpg" alt="Dae" className='w-6/12 rounded-3xl object-contain daedrop' />


            </div>

        </>
    );
}