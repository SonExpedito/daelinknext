import Button from '@/src/components/elements/buttons/button';
import { useUserStore } from '@/src/components/store/userstore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppCard from '../../Comum/Home/appCard';
import HomeCards from './homecards';

export default function HomePCD() {
    const userProfile = useUserStore((state) => state.userProfile);
    const router = useRouter();

    const [firstName = "", secondName = ""] = (userProfile?.name ?? "").split(" ");
    const displayName = `${firstName} ${secondName}`.trim();

    function handleButtonClick() {
        router.push('/processos');
    }

    const text = `Nem sempre as coisas dão certo de uma vez, persistir é a sua, é nossa força.`;

    return (
        <>
            <div className="w-full flex items-center justify-center heroHeight ">
                <div className="h-full w-1/2 ">
                    <div className='h-full w-full flex flex-col justify-center px-20 gap-8'>

                        <div className='flex gap-2'>
                            <img src="./link.png" alt="link Icon" className='w-8 h-8 object-cover' />
                            <h1 className='text-3xl font-bold text-color uppercase'>Continue.
                                <span className='primary-color'>Transforme.</span> Caminhe.
                            </h1>
                        </div>


                        <p className='text-color flex text-2xl flex-wrap'>
                           {text} <span className='secondary-color'>conexão.</span>       
                        </p>

                        <div className='flex gap-4 items-center '>
                            <Button label="Processos" onClick={() => { handleButtonClick() }} type='button'  className='background-blue'/>
                            <Link className='text-lg cursor-pointer' href='/sobre'>Sobre</Link>
                        </div>
                    </div>
                </div>


                <div className="h-full w-1/2">
                    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
                        <img src="./effect.png" alt="Effect" className='absolute h-2/3 top-10/12 right-0' />

                        <div className="flex flex-col items-center gap-4">
                            <p className="text-4xl font-bold secondary-color uppercase">{firstName}</p>
                            <img src={userProfile?.imageUrl} alt="Company Card" className="object-cover h-72 w-72 card-drop rounded-3xl " />
                            <p className="text-4xl font-bold secondary-color uppercase">{secondName}</p>
                        </div>

                    </div>
                </div>
            </div>

            <AppCard />
            <HomeCards />
        </>
    );
}