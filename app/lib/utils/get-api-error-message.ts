function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function stringifyMessage(message: unknown): string | undefined {
    if (typeof message === "string") {
        return message;
    }

    if (Array.isArray(message)) {
        return message
            .filter((item): item is string => typeof item === "string")
            .join("\n");
    }

    return undefined;
}

export function getApiErrorMessage(
    error: unknown,
    fallback = "Сталася помилка. Спробуйте ще раз.",
) {
    if (!isRecord(error)) {
        return fallback;
    }

    const directMessage = stringifyMessage(error.message);

    if (directMessage) {
        return directMessage;
    }

    const data = error.data;

    if (isRecord(data)) {
        const message = stringifyMessage(data.message);

        if (message) {
            return message;
        }

        const errorText = stringifyMessage(data.error);

        if (errorText) {
            return errorText;
        }
    }

    return fallback;
}
