export const beautifyDate = (date: string) => {
    const d = new Date(date);

    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const minutes = d.getMinutes();
    const hours = d.getHours();

    return `${toStr(day)}.${toStr(month)}.${year} ${toStr(hours)}:${toStr(minutes)}`
}

const toStr = (n: number) => n >= 10 ? n : `0${n}`;