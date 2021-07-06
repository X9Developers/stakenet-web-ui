export const Uuid = {
    from(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
            // tslint:disable-next-line: no-bitwise
            const random = Math.random() * 16 | 0;
            const value = char === 'x' ? random : (random % 4 + 8);
            return value.toString(16);
        });
    }
};
