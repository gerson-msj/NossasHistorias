import DialogComponent from "../dialog.component";

export default abstract class ViewModel {

    private timeoutId: number | null = null;

    constructor() {

    }

    protected getElement<T>(name: string): T {
        return document.querySelector(`#${name}`) as T;
    }

    protected saveData(ev: KeyboardEvent) {
        if (this.timeoutId !== null)
            clearTimeout(this.timeoutId);

        this.timeoutId = setTimeout(() => {
            const target = ev.target as HTMLTextAreaElement | HTMLInputElement;
            localStorage.setItem(target.id, target.value);
        }, 500);
    }

    protected restoreData(...target: HTMLElement[]) {
        target.forEach(t => {
            const e = t as HTMLTextAreaElement | HTMLInputElement;
            e.value = localStorage.getItem(t.id) ?? ""
        });
    }
}