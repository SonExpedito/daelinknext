import { useRouter } from 'next/navigation';
import './pcdhome.css'
import Button from '@/src/components/elements/buttons/button';

export default function HomeCards() {
    const router = useRouter();


    const famousCompany: Record<string, { logo: string; nome: string; texto: string; link: string }> = {
        "1": { logo: './pcd/cardshome/nike.png', nome: "nike", texto: "Transforme os Desafios em Oportunidades", link: "/empresas/nike" },
        "2": { logo: './pcd/cardshome/apple.png', nome: "apple", texto: "Pense Diferente.", link: "/empresas/apple" }
    }

    const companyKeys = Object.keys(famousCompany);
    const randomKey = companyKeys[Math.floor(Math.random() * companyKeys.length)];
    const company = famousCompany[randomKey];


    return (
        <div className='h-auto w-full flex flex-col justify-center items-center gap-4 py-4'>
            <h1 className='text-4xl font-bold text-color text-center'>Mude. <span className='primary-color'>Transforme-se.</span></h1>
            <div className='homecardsheight flex w-full justify-center items-center'>
                <div className='h-full w-1/2 items-center justify-center flex flex-col gap-8'>


                    <div className='w-9/12 h-2/6 rounded-3xl cardshadow flex bg-white hover-size overflow-hidden'>
                        <div className='h-full w-2/5 flex'>
                            <img src={company.logo} alt={company.nome} className='w-full h-full object-cover ' />
                        </div>
                        <div className='h-full w-3/5 flex items-center justify-center flex-col gap-4'>
                            <h2 className='text-xl font-medium text-center text-[#1C1C1C]'>{company.texto}</h2>
                            <Button label={company.nome} onClick={() => { router.push(company.link) }} type="button" className='background-green capitalize' />
                        </div>
                    </div>

                    <div className='w-9/12 h-2/6 rounded-3xl cardshadow flex bg-[#1C1C1C] hover-size overflow-hidden'>

                        <div className='h-full w-3/5 flex items-center justify-center flex-col gap-4'>
                            <h2 className='text-xl font-medium text-center text-white px-4'>BUSQUE. TRANSFORME. ACESSE.</h2>
                            <Button label="Vagas" onClick={() => { router.push(`/vagas`) }} type="button" className='background-blue capitalize ' />
                        </div>

                        <div className='h-full w-2/5 flex'>
                            <img src="./pcd/cardshome/vagas.png" alt="Vagas" className='w-full h-full object-cover ' />
                        </div>
                    </div>



                </div>
                <div className='h-full w-1/2 items-center justify-center flex flex-col'>
                    <div className='w-11/12 h-5/6 rounded-3xl cardshadow flex flex-col background-green hover-size overflow-hidden'>
                        <div className='h-1/3 w-full p-8 pr-16 '>
                            <h1 className='text-3xl  font-bold text-white uppercase'>Ideias Inteligentes para Cidades Inteligentes</h1>
                        </div>

                        <div className='h-2/3 w-full flex items-center justify-center'>
                            <div className='h-full w-1/2 flex flex-col gap-4 items-center justify-center pb-8'>
                                <p className='pl-8 text-white text-lg font-medium'>Encontre oportunidades que desafiam padrões, conecte-se com ideias inteligentes e faça parte das mudanças que impactam cidades e pessoas.</p>
                                <Button label="IBM" onClick={() => { router.push(`/empresas/ibm`) }} type="button" />
                            </div>

                            <div className='h-full w-1/2 flex items-center justify-center '>
                                <img src="/pcd/cardshome/ibmcard.png" alt="IBM Card" className='h-full w-full object-contain' />
                            </div>

                        </div>

                    </div>
                </div>

            </div>

        </div>
    );
}
