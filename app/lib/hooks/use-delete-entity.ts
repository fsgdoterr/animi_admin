import { useCallback } from "react";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "~/lib/utils/get-api-error-message";

type Id = string | number;

type MutationResult = {
    unwrap: () => Promise<unknown>;
};

interface UseDeleteEntityOptions<TItem, TId extends Id> {
    deleteMutation: (id: TId) => MutationResult;
    getId: (item: TItem) => TId;
    getConfirmMessage: (item: TItem) => string;
    successMessage: string;
    errorMessage: string;
    itemsOnPage: number;
    page: number;
    onLastPageItemDeleted: () => void;
}

export function useDeleteEntity<TItem, TId extends Id>({
    deleteMutation,
    getId,
    getConfirmMessage,
    successMessage,
    errorMessage,
    itemsOnPage,
    page,
    onLastPageItemDeleted,
}: UseDeleteEntityOptions<TItem, TId>) {
    return useCallback(
        async (item: TItem) => {
            const answer = window.confirm(getConfirmMessage(item));

            if (!answer) {
                return;
            }

            try {
                await deleteMutation(getId(item)).unwrap();
                toast.success(successMessage);

                if (itemsOnPage === 1 && page > 1) {
                    onLastPageItemDeleted();
                }
            } catch (error) {
                toast.error(getApiErrorMessage(error, errorMessage));
            }
        },
        [
            deleteMutation,
            errorMessage,
            getConfirmMessage,
            getId,
            itemsOnPage,
            onLastPageItemDeleted,
            page,
            successMessage,
        ],
    );
}
