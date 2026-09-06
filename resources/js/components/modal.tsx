import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
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

export default function Modal({
    isOpen,
    show,
    onClose,
    title,
    children,
    maxWidth = 'max-w-2xl',
}: ModalProps) {
    const isVisible = Boolean(isOpen ?? show ?? false);
    const resolvedMaxWidth = maxWidth.startsWith('max-w-')
        ? maxWidth
        : `max-w-${maxWidth}`;

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
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm dark:bg-black/80" />
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
                            <DialogPanel
                                className={`w-full ${resolvedMaxWidth} relative transform overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-left align-middle text-slate-900 shadow-2xl transition-all sm:p-8 dark:border-slate-800 dark:bg-[#0D172E] dark:text-slate-100`}
                            >
                                {title ? (
                                    <div className="mb-6 flex items-center justify-between">
                                        <DialogTitle
                                            as="h3"
                                            className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white"
                                        >
                                            {title}
                                        </DialogTitle>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                            aria-label="Cerrar modal"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
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
