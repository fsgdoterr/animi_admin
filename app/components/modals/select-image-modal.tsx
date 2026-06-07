import { X } from "lucide-react";
import Button from "~/components/ui/buttons/button";
import ListSearch from "~/components/ui/list-search";
import Pagination from "~/components/ui/pagination/pagination";
import { API_URL } from "~/lib/constants/api";
import { useListSearchParams } from "~/lib/hooks/use-list-search-params";
import { useSyncPaginationBounds } from "~/lib/hooks/use-sync-pagination-bounds";
import { useGetAllImagesQuery } from "~/lib/store/animi/image.endpoints";
import type { Image } from "~/lib/types/entities/image-type";

interface Props {
    onHide: () => void;
    onSelect: (img: Image) => void;
}

export default function SelectImageModal({ onHide, onSelect }: Props) {
    const {
        page,
        limit,
        search,
        searchValue,
        setSearchValue,
        clearSearch,
        setPagination,
        onPageChange,
        onLimitChange,
    } = useListSearchParams();

    const { data, isLoading, isFetching } = useGetAllImagesQuery({
        page,
        limit,
        search: search || undefined,
    });

    const images = data?.items ?? [];
    const totalCount = data?.totalCount ?? 0;

    useSyncPaginationBounds({
        page,
        limit,
        totalCount,
        isFetching,
        setPagination,
    });

    const hide = () => {
        onHide();
    };

    const select = (img: Image) => {
        onSelect(img);
        onHide();
    };

    return (
        <div
            className="fixed w-full h-dvh left-0 top-0 z-50 backdrop-blur-xl flex items-center justify-center"
            onMouseDown={hide}
        >
            <div
                className="w-93.75 p-5 rounded-xl bg-(--bg-1) ring-1 ring-(--bg-2) drop-shadow-2xl flex flex-col gap-2.5"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <p>Обрати зображення</p>
                    <Button
                        isQuad
                        color="TRANSPARENT"
                        transparent
                        onClick={() => hide()}
                    >
                        <X size={16} />
                    </Button>
                </div>
                <ListSearch
                    value={searchValue}
                    placeholder="Пошук..."
                    onChange={setSearchValue}
                    onClear={clearSearch}
                />
                <hr className="text-(--bg-4)" />
                <div className="grid grid-cols-3 gap-2.5">
                    {images.map((img) => (
                        <button
                            className="flex-1 aspect-square bg-(--bg-2) rounded-xl overflow-hidden group cursor-pointer"
                            key={img.id}
                            type="button"
                            onClick={() => select(img)}
                        >
                            <img
                                className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-200"
                                src={API_URL + "/uploads/" + img.path}
                                alt={img.alt || "Select img"}
                            />
                        </button>
                    ))}
                </div>
                <Pagination
                    page={page}
                    limit={limit}
                    totalCount={totalCount}
                    isLoading={isLoading || isFetching}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                />
            </div>
        </div>
    );
}
