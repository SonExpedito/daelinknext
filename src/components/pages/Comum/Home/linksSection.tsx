import './homepage.css';


export default function LinkSection() {

    const linkslogos = [
        { src: "./home/companies/apple.png", alt: "Apple" },
        { src: "./home/companies/google.png", alt: "Google" },
        { src: "./home/companies/ibm.png", alt: "IBM" },
        { src: "./home/companies/nike.png", alt: "Nike" },

    ]

    const linksText = `Conecte-se com as maiores empresas do mercado, 
    amplie seus horizontes e impulsione sua carreira ao lado de quem lidera a inovação. Seu próximo passo começa aqui.`



    return (
        <div className="w-full flex flex-col items-center sectionHeight py-8 ">
            <h1 className='text-color text-4xl font-bold text-center '> <span className='secondary-color'>LINK-SE</span> com as Empresas</h1>

            <div className='h-full w-full flex items-center justify-center'>

                <div className="h-full w-1/2 grid grid-cols-2 items-center justify-items-center ">
                    {linkslogos.map((link, index) => (
                        <img key={index} src={link.src} alt={link.alt} className="object-contain h-24" />
                    ))}
                </div>



                <div className='h-full w-1/2 flex items-center justify-center'>
                    <p className='text-color text-2xl  px-12'>{linksText}</p>
                </div>


            </div>
        </div>
    );
}