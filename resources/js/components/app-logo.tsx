export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-blue-900/10 p-1 dark:bg-white/10">
                <img
                    src="/assets/img/booz_symbol_icon.png"
                    alt="Booz Laboratorio"
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-sm leading-none font-black tracking-tight text-slate-900 uppercase dark:text-white">
                    BOOZ{' '}
                    <span className="font-light text-blue-600 dark:text-cyan-400">
                        LAB
                    </span>
                </span>
                <span className="mt-0.5 text-[9px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Consola Clínica
                </span>
            </div>
        </div>
    );
}
