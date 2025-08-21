


export default function WorldShow() {

    return (
        <div className="w-full flex items-center justify-center worldShowHeight">
            <div className="h-full w-1/2 flex justify-center items-center ">
                <img src="./home/globo.png" alt="Mapa Mundi Empresarial" className=" w-10/12  lg:max-lg:h-9/12" />
            </div>

            <div className="h-full w-1/2 flex flex-col justify-center items-center text-color gap-2 text-center">
                <h1 className="text-3xl font-bold ">Você é <span className="secondary-color uppercase">Inspiração</span>.</h1>
                <h1 className="text-3xl font-bold ">Deixe o <span className="primary-color uppercase">Mundo</span> conhecer sua capacidade.</h1>
            </div>

        </div>

    )

}