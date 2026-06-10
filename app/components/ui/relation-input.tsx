import { useState } from "react";
import { createPortal } from "react-dom";
import SelectRelationModal from "~/components/modals/select-relation-modal";
import RelationItem from "~/components/relation-item";
import Button from "~/components/ui/buttons/button";
import Loader from "~/components/ui/loader";
import { useLazyGetOneAnimeQuery } from "~/lib/store/animi/animes.endpoints";
import type { AnimeBase, Relation } from "~/lib/types/entities/anime-type";

type ValueType = Relation & { type: "ANIME" | "RELATION" };

interface Props {
    value?: ValueType;
    onChange: (value: ValueType) => void;
    loading: boolean;
}

export default function RelationInput({ value, onChange, loading }: Props) {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [getAni, { isFetching }] = useLazyGetOneAnimeQuery();

    const select = async (ani: AnimeBase) => {
        const animeResponse = await getAni(ani.id);
        if (!animeResponse.data) {
            return unselect();
        }
        const anime = animeResponse.data;
        const relation = anime.relation;

        if (relation) {
            return onChange({
                id: relation.id,
                items: relation.items,
                type: "RELATION",
            });
        }

        onChange({
            id: anime.id,
            type: "ANIME",
            items: [anime],
        });
    };

    const unselect = () => {
        onChange({
            id: -1,
            type: "ANIME",
            items: [],
        });
    };

    return (
        <div>
            {!!value?.items.length && (
                <div className="bg-(--bg-1) p-5 rounded-xl flex flex-col gap-2.5">
                    <div className="flex justify-between">
                        <div></div>
                        <Button
                            isQuad
                            color="RED"
                            transparent
                            onClick={unselect}
                            type="button"
                        >
                            Переобрати
                        </Button>
                    </div>
                    {!!value.items.length && (
                        <div className="grid grid-cols-3 gap-2.5">
                            {value.items.map((ani) => (
                                <RelationItem key={ani.id} anime={ani} />
                            ))}
                        </div>
                    )}
                    {loading && (
                        <div className="flex justify-center">
                            <Loader />
                        </div>
                    )}
                </div>
            )}
            {isFetching && (
                <div className="w-full flex justify-center">
                    <Loader />
                </div>
            )}
            {!value?.items.length && !isFetching && (
                <>
                    <Button
                        transparent
                        color="GREEN"
                        isQuad
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="self-start"
                    >
                        Обрати
                    </Button>
                    {showModal &&
                        createPortal(
                            <SelectRelationModal
                                onHide={() => setShowModal(false)}
                                onSelect={(ani) => select(ani)}
                            />,
                            document.body,
                        )}
                </>
            )}
        </div>
    );
}
