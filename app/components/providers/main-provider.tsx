import type { PropsWithChildren } from "react";

export default function MainProvider({children}: PropsWithChildren) {
    return(
        <>
            {children}
        </>
    )
}