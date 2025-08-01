import './homepage.css';

export default function HomePage() {

    const heroTexts = [
        {
            description: `A mudança é necessária para evoluir, de forma convicta e objetiva.
Assim como você, buscamos a nossa.`
        }
    ];



    return (
        <>
            <div className="w-full flex items-center justify-center heroHeight ">
                <div className="h-full w-1/2 flex flex-col items-center justify-center">
                    <div className='flex gap-2'>
                        <img src="./link.png" alt="link Icon" className='w-8 h-8 object-cover' />
                        <h1 className='text-2xl font-bold text-color uppercase'>Desafie.
                            <span className='primary-color'>Conecte.</span> Transforme.</h1>
                    </div>
                </div>


                <div className="h-full w-1/2">
                </div>
            </div>
        </>
    );
}