import { useEffect, useState, type RefObject } from "react";

export const useIntersectionObserver = (ref: RefObject<null | HTMLElement>) => {
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

    useEffect(() => {
        let observer: IntersectionObserver | undefined;
        if (ref.current) {
            observer = new IntersectionObserver(
                (entries) => {
                    setIsIntersecting(entries[0].isIntersecting);
                },
                {
                    // root
                    // threshold: 1.0,
                },
            );
            observer.observe(ref.current);
        }
        return () => observer?.disconnect();
    }, [ref]);

    return isIntersecting;
};
