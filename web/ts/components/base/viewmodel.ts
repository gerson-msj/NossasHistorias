export default abstract class ViewModel {

    constructor() {}

    protected getElement<T>(name: string): T {
        return document.querySelector(`#${name}`) as T;
    }
}