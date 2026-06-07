export const beautifyNumber = (number: number): string => {
    const sign = number < 0 ? "-" : "";
    const absNumber = Math.abs(number);

    const units = [
        { value: 1_000_000_000_000, suffix: "t" },
        { value: 1_000_000_000, suffix: "b" },
        { value: 1_000_000, suffix: "m" },
        { value: 1_000, suffix: "k" },
    ];

    const unit = units.find((unit) => absNumber >= unit.value);

    if (!unit) {
        return `${number}`;
    }

    const shortened = absNumber / unit.value;

    // Обрезаем до 1 знака после запятой, не округляем
    const truncated = Math.trunc(shortened * 10) / 10;

    // Убираем .0 если число целое
    const formatted = Number.isInteger(truncated)
        ? `${truncated}`
        : `${truncated}`;

    return `${sign}${formatted}${unit.suffix}`;
};
