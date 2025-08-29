import { motion } from "framer-motion";


export default function Carregamento() {

    return (
        <div className="min-h-svh w-full flex justify-center items-center ">
            <motion.div
                className="w-12 h-12 border-4 border-t-[#2469F5] border-white/30 rounded-full mb-4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            ></motion.div>
        </div>
    )

}
