declare global {
    interface Number {
        fmt: string;
    }
}

Object.defineProperty(Number.prototype, "fmt", {
    get: function() {
        return this.toLocaleString('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    enumerable: false,
    configurable: true
});

export {};