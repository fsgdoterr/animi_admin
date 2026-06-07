import clsx from "clsx";
import { AnimeStatus } from "~/lib/constants/anime-status";

interface Props {
    status: AnimeStatus;
}

export default function AnimeStatusPlate({
    status
}: Props) {
    return (
        <span className={clsx(
            "text-xs py-1 px-2 rounded-md ring-1",
            status === AnimeStatus.DRAFT && "bg-(--grey-2)/35 ring-(--grey-2)",
            status === AnimeStatus.ANNOUNCED && "bg-(--yellow)/35 ring-(--yellow) text-(--yellow)",
            status === AnimeStatus.CANCELLED && "bg-(--red)/35 ring-(--red) text-(--red)",
            status === AnimeStatus.COMPLETED && "bg-(--blue)/35 ring-(--blue) text-(--blue)",
            status === AnimeStatus.ONGOING && "bg-(--green)/35 ring-(--green) text-(--green)",
        )}>
            {status}
        </span>
    );
}
