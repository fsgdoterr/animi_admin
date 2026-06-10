import { useEffect, useState } from "react";

export const useDebouncedValue = (value: any, delay: number = 500) => {
    const [debounced, setDebounced] = useState<any>();

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
};
