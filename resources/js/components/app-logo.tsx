export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-blue-900/10 p-1">
                <img
                    src="/assets/img/booz_symbol_icon.png"
                    alt="Booz Laboratorio"
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-tight text-slate-900 leading-none uppercase">
                    BOOZ <span className="text-blue-600 font-light">LAB</span>
                </span>
                <span className="text-[9px] tracking-wider text-slate-500 font-bold uppercase mt-0.5">
                    Consola Clínica
                </span>
            </div>
        </div>
    );
}
