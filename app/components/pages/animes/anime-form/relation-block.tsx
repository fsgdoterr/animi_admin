import { useFormContext } from "react-hook-form";
import type { AnimeFormType } from "~/lib/types/forms/anime.form-type";

export default function RelationBlock() {
    const {
        register
    } = useFormContext<AnimeFormType>();
    return(
        <div className="flex flex-col gap-2.5">
            <div>Пов'язане</div>
        </div>
    );
}