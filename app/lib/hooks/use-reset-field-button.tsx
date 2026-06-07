import { useCallback } from "react";
import { RotateCcw } from "lucide-react";
import type {
    FieldNamesMarkedBoolean,
    FieldValues,
    Path,
    UseFormResetField,
} from "react-hook-form";
import Button from "~/components/ui/buttons/button";

interface UseResetFieldButtonOptions<TForm extends FieldValues> {
    dirtyFields: Partial<Readonly<FieldNamesMarkedBoolean<TForm>>>;
    resetField: UseFormResetField<TForm>;
    showResetButtons?: boolean;
}

export function useResetFieldButton<TForm extends FieldValues>({
    dirtyFields,
    resetField,
    showResetButtons = false,
}: UseResetFieldButtonOptions<TForm>) {
    return useCallback(
        (fieldName: Path<TForm>) => {
            if (!showResetButtons) {
                return null;
            }

            const isDirty = Boolean(
                (dirtyFields as Record<string, unknown>)[fieldName],
            );

            return (
                <Button
                    type="button"
                    color="BLUE"
                    transparent
                    isQuad
                    disabled={!isDirty}
                    tooltipText="Скинути поле"
                    onClick={() => resetField(fieldName)}
                    className="shrink-0 self-stretch"
                >
                    <RotateCcw size={16} />
                </Button>
            );
        },
        [dirtyFields, resetField, showResetButtons],
    );
}
