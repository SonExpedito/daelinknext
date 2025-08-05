import { Search } from "lucide-react";
import Link from "next/link";


export default function Navbar() {
    return (
        <div className="w-full h-20 background-primary px-12 fixed z-50">
            <div className="h-full w-full flex relative justify-center items-center  text-color ">

                <Link href="/" className="absolute left-0 flex h-full items-center">
                    <img src="./logo.png" alt="Logo" className=" flex object-contain h-2/4"/>
                </Link>

                <div className="h-full items-center flex  justify-center gap-4 text-background text-color">
                    <Link href="/empresas" className="text-color text-hover">Empresas</Link>
                    <Link href="/vagas" className="text-color text-hover">Vagas</Link>
                    <Link href="/sobre" className="text-color text-hover">Sobre</Link>
                </div>

                <div className="flex gap-4 h-full  w-auto justify-center items-center  absolute right-0  ">
                    <button className="cursor-pointer"><Search className="text-color text-hover" /></button>

                    <button>
                        <img
                            src="https://images2.minutemediacdn.com/image/upload/c_crop,w_4000,h_2250,x_0,y_9/c_fill,w_1200,ar_4:3,f_auto,q_auto,g_auto/images/GettyImages/mmsport/90min_en_international_web/01jczr9sq67ky36mtztb.jpg"
                            alt="User"
                            className="rounded-full cursor-pointer object-cover h-10 w-10 border-blue-400 border-4"
                        />
                    </button>
                </div>
            </div>
        </div>
    )


}