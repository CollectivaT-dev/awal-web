'use client';
import { useCallback, useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface ModalProps {
    isOpen?: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: string;
    disabled?: boolean;
    secondaryAction?: () => void;
    secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryActionLabel,
}) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(
        () => setShowModal(isOpen),

        [isOpen],
    );

    const handleClose = useCallback(() => {
        if (disabled) {
            return;
        }

        setShowModal(false);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [disabled, onClose]);

    const handleSubmit = useCallback(() => {
        if (disabled) return;
        onSubmit();
    }, [disabled, onSubmit]);

    const handleSecondaryAction = useCallback(() => {
        if (disabled || !secondaryAction) return;

        secondaryAction();
    }, [secondaryAction, disabled]);

    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none capitalize focus:outline-none bg-neutral-800/70">
                <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/6 my-6 mx-auto h-full lg:h-auto md:h-auto">
                    {/*//@ content */}
                    <div
                        className={`translate duration-300 h-full ${
                            showModal ? 'translate-y-0' : 'translate-y-full'
                        }${showModal ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex w-full flex-col bg-white outline-none focus:outline-none">
                            {/*//@ header */}
                            <div className="flex items-center p-6 rounded-t relative justify-center border-b-[1px]">
                                <button
                                    onClick={handleClose}
                                    className="p-1 border-0 hover:opacity-70 transition absolute left-9"
                                >
                                    <XCircle size={30} />
                                </button>
                                <div className="text-lg font-semibold capitalize">
                                    {title}
                                </div>
                            </div>
                            {/*//@ body */}
                            <div className="relative p-6 flex-auto capitalize">
                                {body}
                            </div>
                            {/* footer */}
                            <div className="flex flex-col gap-2 p-6">
                                <div className="flex flex-row items-center gap-4 w-full">
                                    {secondaryAction &&
                                        secondaryActionLabel && (
                                            <Button
                                                disabled={disabled}
                                                onClick={handleSubmit}
                                            >
                                                text
                                            </Button>
                                        )}
                                    <Button
                                        className={`relative disabled:opacity-70 disabled:cursor-not-allowed capitalize rounded-lg hover:opacity-80 transition w-full
										`}
                                        disabled={disabled}
                                        onClick={handleSubmit}
                                    >
                                        text2
                                    </Button>
                                </div>
                                {footer}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
