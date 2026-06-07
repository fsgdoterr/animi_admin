import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "~/lib/store";

export default function MainProvider({ children }: PropsWithChildren) {
    return (
        <Provider store={store}>
            {children}
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 3500,
                    style: {
                        background: "#181d22",
                        color: "#fff",
                        border: "1px solid #293541",
                    },
                    success: {
                        iconTheme: {
                            primary: "#36cb68",
                            secondary: "#181d22",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ff3333",
                            secondary: "#181d22",
                        },
                    },
                }}
            />
        </Provider>
    );
}
