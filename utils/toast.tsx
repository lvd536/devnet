import { toast } from "sonner";

type Position =
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";

interface IProps {
    title: string;
    description?: string;
    type: "success" | "default" | "info" | "warning" | "error" | "promise";
    position?: Position;
    promise?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        func: () => Promise<any>;
        loadingMessage?: string;
        successMessage?: string;
        errorMessage?: string;
    };
}

export const sendToast = (props: IProps) => {
    const { type, title, description, promise, position } = props;
    switch (type) {
        case "success":
            toast.success(title, { description, position });
            break;
        case "default":
            toast(title, { description, position });
            break;
        case "info":
            toast.info(title, { description, position });
            break;
        case "warning":
            toast.warning(title, { description, position });
            break;
        case "error":
            toast.error(title, { description, position });
            break;
        case "promise":
            if (!promise) return;
            toast.promise(promise.func, {
                loading: promise.loadingMessage || "Загрузка...",
                position,
                success: () => (
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{title}</span>
                        <span className="text-xs text-muted-foreground">
                            {promise.successMessage || description}
                        </span>
                    </div>
                ),
                error: (err) => (
                    <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">Ошибка</span>
                        <span className="text-xs text-muted-foreground">
                            {promise.errorMessage ||
                                err.message ||
                                "Произошла ошибка"}
                        </span>
                    </div>
                ),
            });
            break;
    }
};
