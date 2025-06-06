import Service from "./service";
import ViewModel from "./viewmodel";

export default abstract class Component<TViewModel extends ViewModel, TService extends Service> extends HTMLElement {

    private _service: TService | null = null;
    protected get service() { return this._service! }

    private _viewModel: TViewModel | null = null;
    protected get viewModel() { return this._viewModel!; }

    private _tokenSubject: number | null = null;
    protected get tokenSubject() { return this._tokenSubject; }

    private modelPath: string;

    abstract initialize(): Promise<void>;

    constructor(modelName: string) {
        super();
        this.modelPath = `/models/${modelName}.model.html`;
    }

    async connectedCallback() {
        await this.initializeElement();
    }

    private async initializeElement() {
        await this.initializeModel();
        // Avaliar inclusão de try catch, apresentando erro genérico em popup e retornando a intro.
        await this.initialize();
        this.dispatchEvent(new Event("initialized"));
    }

    private async initializeModel() {
        const requestModel = await fetch(this.modelPath);
        const model = await requestModel.text();
        const modelTemplate = document.createElement("div");
        modelTemplate.innerHTML = model;
        const template = modelTemplate.querySelector("template") as HTMLTemplateElement;
        this.appendChild(template.content.cloneNode(true));
    }

    protected validarTokenSubject(): boolean {
        try {
            const token = localStorage.getItem("token");
            const payload: { sub: number } = JSON.parse(atob(token!.split(".")[1]));
            this._tokenSubject = payload.sub;
            return true;
        } catch (error) {
            this._tokenSubject = null;
            return false;

        }
    }

    protected initializeResources(viewModel: new () => TViewModel, service: new () => TService): Promise<void> {
        this._service = new service();
        this._viewModel = new viewModel();
        return Promise.resolve();
    }

    protected dispatch(eventName: string) {
        this.dispatchEvent(new Event(eventName));
    }
}