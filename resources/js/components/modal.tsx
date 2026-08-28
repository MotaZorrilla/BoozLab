import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

interface ModalProps {
    isOpen?: boolean;
    show?: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidth?: string;
}

export default function Modal({ isOpen, show, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
    const isVisible = Boolean(isOpen ?? show ?? false);
    const resolvedMaxWidth = maxWidth.startsWith('max-w-') ? maxWidth : `max-w-${maxWidth}`;

    return (
        <Transition show={isVisible} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <DialogPanel className={`w-full ${resolvedMaxWidth} transform overflow-hidden rounded-3xl bg-white dark:bg-[#0D172E] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left align-middle shadow-2xl transition-all relative`}>
                                {title ? (
                                    <div className="flex items-center justify-between mb-6">
                                        <DialogTitle as="h3" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                            {title}
                                        </DialogTitle>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                                            aria-label="Cerrar modal"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer z-10"
                                        aria-label="Cerrar modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                
                                <div className={title ? 'mt-2' : ''}>
                                    {children}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
