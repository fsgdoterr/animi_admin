import type { FieldErrors, FieldValues } from "react-hook-form";
import toast from "react-hot-toast";

export function collectFormErrorMessages<T extends FieldValues>(
    errors: FieldErrors<T>,
) {
    const messages: string[] = [];

    const collect = (value: unknown) => {
        if (!value || typeof value !== "object") {
            return;
        }

        const error = value as Record<string, unknown>;

        if (typeof error.message === "string") {
            messages.push(error.message);
            return;
        }

        Object.entries(error).forEach(([key, nestedValue]) => {
            if (["message", "ref", "type", "types"].includes(key)) {
                return;
            }

            collect(nestedValue);
        });
    };

    collect(errors);

    return messages;
}

export function showFormErrorsToast<T extends FieldValues>(
    errors: FieldErrors<T>,
) {
    const messages = collectFormErrorMessages(errors);

    toast.error(
        <div className="flex flex-col gap-1">
            <span>Перевірте поля форми:</span>
            {messages.map((message) => (
                <span key={message}>• {message}</span>
            ))}
        </div>,
    );
}
