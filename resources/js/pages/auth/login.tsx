import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import BoozLayout from '@/layouts/booz-layout';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister?: boolean;
};

export default function Login({
    status,
    canResetPassword,
}: Props) {
    return (
        <BoozLayout>
            <Head title="Acceso a la Consola | Booz Laboratorio" />

            <div className="min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Card de Acceso Clínico */}
                    <div className="bg-white dark:bg-[#0D172E] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-900/5 p-6 sm:p-8 backdrop-blur-sm">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#002072] dark:text-cyan-400 border border-blue-100 dark:border-blue-900/40 mb-4 shadow-sm">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Consola de Administración
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                                Acceso restringido para personal médico, farmacéutico y administrativo de Booz Laboratorio.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                                {status}
                            </div>
                        )}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="flex flex-col gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                Correo Institucional
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="usuario@boozlaboratorio.com"
                                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    Contraseña
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-xs font-semibold text-blue-600 dark:text-cyan-400 hover:underline"
                                                        tabIndex={5}
                                                    >
                                                        ¿Olvidó su contraseña?
                                                    </TextLink>
                                                )}
                                            </div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••"
                                                className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="flex items-center space-x-2.5 pt-1">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label htmlFor="remember" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                                                Mantener sesión activa en este equipo
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-3 w-full h-11 rounded-xl bg-[#002072] hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/20 transition-all cursor-pointer"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && <Spinner className="mr-2 h-4 w-4" />}
                                            <span>Ingresar a la Consola</span>
                                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                Sistema de Gestión Sanitaria y Vademécum Booz Laboratorio VGME, C.A.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </BoozLayout>
    );
}
