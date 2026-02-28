import { JSX } from "react";
import { X } from "lucide-react";

interface IProps {
    label: string;
    onClose: () => void;
    elements?: JSX.Element[];
}

export default function BaseModal({ label, elements, onClose }: IProps) {
    return (
        <div className="fixed left-0 top-0 flex items-center justify-center w-screen h-screen bg-black/30 z-99">
            <div className="flex flex-col gap-2 py-4 rounded-xl bg-[#222224] w-8/10 lg:w-80">
                <div className="flex w-full items-center justify-between gap-2 mb-1 px-4">
                    <p className="text-xl font-bold">{label}</p>
                    <X
                        width={35}
                        height={35}
                        className="flex items-center justify-center p-2 rounded-full bg-[#2a2a2a]"
                        onClick={onClose}
                    />
                </div>
                <div className="flex flex-col border-t border-t-border overflow-y-auto">
                    {elements && elements.length > 0 ? (
                        elements
                    ) : (
                        <p className="font-medium text-center text-text-muted text-lg mt-4">
                            Пусто...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
