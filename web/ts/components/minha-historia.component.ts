import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class MinhaHistoriaViewModel extends ViewModel {

    private excluir: HTMLButtonElement;
    private _titulo: HTMLHeadingElement;

    public get titulo() { return this._titulo.innerText; }
    public set titulo(value: string) { this._titulo.innerText = value; }

    public onExcluir = () => { };

    constructor() {
        super();
        this._titulo = this.getElement("tituloHistoria");
        this.excluir = this.getElement("excluir");
        this.excluir.addEventListener("click", () => this.onExcluir());
    }
}

class MinhaHistoriaService extends Service {

}

class MinhaHistoriaComponent extends Component<MinhaHistoriaViewModel, MinhaHistoriaService> {

    constructor() {
        super("minha-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(MinhaHistoriaViewModel, MinhaHistoriaService);
        this.viewModel.onExcluir = () => this.dispatchEvent(new Event("excluir"));
        
        this.addEventListener("initializeData", (ev) => {
            const titulo: string = (ev as CustomEvent).detail;
            this.viewModel.titulo = titulo;
        });
    }

}

export default MinhaHistoriaComponent;