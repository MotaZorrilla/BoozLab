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

export default function Login({ status, canResetPassword }: Props) {
    return (
        <BoozLayout>
            <Head title="Acceso a la Consola | Booz Laboratorio" />

            <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Card de Acceso Clínico */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-blue-900/5 backdrop-blur-sm sm:p-8 dark:border-slate-800 dark:bg-[#0D172E]">
                        <div className="mb-8 text-center">
                            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-[#002072] shadow-sm dark:border-blue-900/40 dark:bg-blue-950/80 dark:text-cyan-400">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Consola de Administración
                            </h1>
                            <p className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                Acceso restringido para personal médico,
                                farmacéutico y administrativo de Booz
                                Laboratorio.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
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
                                            <Label
                                                htmlFor="email"
                                                className="text-xs font-bold text-slate-700 dark:text-slate-300"
                                            >
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
                                                className="h-11 rounded-xl border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <div className="flex items-center justify-between">
                                                <Label
                                                    htmlFor="password"
                                                    className="text-xs font-bold text-slate-700 dark:text-slate-300"
                                                >
                                                    Contraseña
                                                </Label>
                                                {canResetPassword && (
                                                    <TextLink
                                                        href={request()}
                                                        className="text-xs font-semibold text-blue-600 hover:underline dark:text-cyan-400"
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
                                                className="h-11 rounded-xl border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2.5 pt-1">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="cursor-pointer text-xs text-slate-600 dark:text-slate-400"
                                            >
                                                Mantener sesión activa en este
                                                equipo
                                            </Label>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="mt-3 h-11 w-full cursor-pointer rounded-xl bg-[#002072] text-xs font-bold text-white shadow-md shadow-blue-900/20 transition-all hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && (
                                                <Spinner className="mr-2 h-4 w-4" />
                                            )}
                                            <span>Ingresar a la Consola</span>
                                            <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="mt-8 border-t border-slate-100 pt-6 text-center dark:border-slate-800/80">
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                Sistema de Gestión Sanitaria y Vademécum Booz
                                Laboratorio VGME, C.A.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </BoozLayout>
    );
}
