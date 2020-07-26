export const removeFromList = <T>(list: T[], item: T): T[] => {
    const index = list.indexOf(item);
    if (index > -1) {
        return [...list.slice(0, index), ...list.slice(index + 1)];
    }
    return list;
};
