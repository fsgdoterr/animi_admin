import { useEffect } from "react";
import CreateAnimePage from "~/components/pages/animes/create-anime-page";
import { useAppDispatch } from "~/lib/hooks/redux";
import { setShowResetButtons } from "~/lib/store/slices/anime-page.slice";

export default function CreateAnime() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setShowResetButtons(false));
    }, []);
    return <CreateAnimePage />
}