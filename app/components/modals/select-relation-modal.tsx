import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "~/components/ui/buttons/button";
import ListSearch from "~/components/ui/list-search";
import Loader from "~/components/ui/loader";
import { API_URL } from "~/lib/constants/api";
import { useDebouncedValue } from "~/lib/hooks/use-debounced-value";
import { useIntersectionObserver } from "~/lib/hooks/use-intersecting-observer";
import { useGetAllAnimeCursorQuery } from "~/lib/store/animi/animes.endpoints";
import type { AnimeBase } from "~/lib/types/entities/anime-type";

interface Props {
    onHide: () => void;
    onSelect: (ani: AnimeBase) => void;
}

export default function SelectRelationModal({ onHide, onSelect }: Props) {
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebouncedValue(search);

    const [cursor, setCursor] = useState<number | undefined>(undefined);
    const [animes, setAnimes] = useState<AnimeBase[]>([]);

    const ref = useRef<HTMLDivElement | null>(null);
    const isIntersecting = useIntersectionObserver(ref);

    const { currentData, isFetching } = useGetAllAnimeCursorQuery({
        search: debouncedSearch,
        limit: 5,
        cursor,
    });

    const hasNextPage = Boolean(currentData?.nextCursor);
    const hasItems = animes.length > 0;

    const isLoadingMore = isFetching && hasItems;

    useEffect(() => {
        setCursor(undefined);
        setAnimes([]);
    }, [debouncedSearch]);

    useEffect(() => {
        if (!currentData) return;

        setAnimes((prev) => {
            if (cursor === undefined) {
                return currentData.items;
            }

            const existingIds = new Set(prev.map((ani) => ani.id));

            const newItems = currentData.items.filter(
                (ani) => !existingIds.has(ani.id),
            );

            return [...prev, ...newItems];
        });
    }, [currentData, cursor]);

    useEffect(() => {
        if (!isIntersecting) return;
        if (isFetching) return;
        if (!currentData?.nextCursor) return;

        setCursor((prev) => {
            if (prev === currentData.nextCursor) return prev;
            return currentData.nextCursor;
        });
    }, [isIntersecting, isFetching, currentData?.nextCursor]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCursor(undefined);
    };

    const select = (ani: AnimeBase) => {
        onSelect(ani);
        onHide();
    };

    return (
        <div
            className="fixed w-full h-dvh left-0 top-0 z-50 backdrop-blur-xl flex items-center justify-center"
            onMouseDown={() => onHide()}
        >
            <div
                className="w-93.75 p-5 rounded-xl bg-(--bg-1) ring-1 ring-(--bg-2) drop-shadow-2xl flex flex-col gap-2.5"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <p>Обрати пов'язане</p>
                    <Button
                        isQuad
                        color="TRANSPARENT"
                        transparent
                        onClick={() => onHide()}
                    >
                        <X size={16} />
                    </Button>
                </div>
                <ListSearch
                    value={search}
                    placeholder="Пошук..."
                    onChange={handleSearchChange}
                    onClear={() => handleSearchChange("")}
                />
                <hr className="text-(--bg-4)" />
                <div className="flex flex-col gap-2.5 h-72 p-1 overflow-y-auto no-scrollbar">
                    {animes.map((ani) => (
                        <button
                            key={ani.id}
                            className="flex bg-(--bg-2) rounded-xl ring-1 ring-(--bg-1) cursor-pointer hover:ring-(--primary) transition group"
                            type="button"
                            onClick={() => select(ani)}
                        >
                            <div className="aspect-square w-20 shrink-0 bg-(--grey-2) rounded-xl overflow-hidden">
                                {ani.poster ? (
                                    <img
                                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-200"
                                        src={`${API_URL}/uploads/${ani.poster.path}`}
                                        alt={ani.poster.alt || ani.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-(--grey-1) group-hover:scale-125 transition-transform duration-200">
                                        Немає
                                    </div>
                                )}
                            </div>

                            <div className="p-2.5 flex-1 min-w-0">
                                <div className="flex justify-between gap-2.5">
                                    <span className="truncate">
                                        {ani.title}
                                    </span>

                                    <div className="flex gap-2.5 shrink-0 text-xs text-(--grey-2)">
                                        <span>{ani.status}</span>
                                        <span>{ani.type}</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                    {hasNextPage && (
                        <div
                            ref={ref}
                            className="w-full min-h-6 flex justify-center items-center"
                        >
                            {isLoadingMore && <Loader />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
