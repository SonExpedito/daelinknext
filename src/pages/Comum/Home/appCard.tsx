import "./homepage.css";


export default function AppCard() {



    return (
        <div className="w-full flex items-center justify-center appPhoneHeight cardcontainer-responsive ">
            <div className="h-11/12 w-2/3 flex background-secondary rounded-4xl  card-responsive ">
                <div className="h-full w-3/5 background-green rounded-4xl flex justify-center items-center">
                    <img src="./home/appphone.png" alt="App Screen" className="object-contain h-11/12" />
                </div>


                <div className="h-full w-2/5  flex flex-col justify-center items-center gap-4 text-background px-4">
                    <h1 className="text-3xl font-black  uppercase text-center "><span className="primary-color">Conecte-se</span> em qualquer lugar</h1>
                    <p className="text-lg">Acesse através da sua Loja de Aplicativos</p>

                    <div className="w-full flex justify-center items-center gap-4">
                        <button className="background-primary h-12 flex items-center justify-center py-2 px-4 rounded-2xl cursor-pointer hover-size">
                            <img src="./icons/appstoreicon.png" alt="App Store" className="object-contain h-11/12" />
                        </button>
                        <button className="background-primary h-12 flex items-center justify-center py-2 px-4 rounded-2xl cursor-pointer hover-size">
                            <img src="./icons/googleicon.png" alt="Google Play" className="object-contain h-11/12" />
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
}