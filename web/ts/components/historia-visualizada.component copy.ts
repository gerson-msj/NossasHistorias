import { HistoriaModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class HistoriaVisualizadaViewModel extends ViewModel {

    private curtir: HTMLButtonElement;
    private _titulo: HTMLHeadingElement;

    public get titulo() { return this._titulo.innerText; }
    public set titulo(value: string) { this._titulo.innerText = value; }

    public onCurtir = () => { };

    constructor() {
        super();
        this._titulo = this.getElement("tituloHistoria");
        this.curtir = this.getElement("curtir");
        this.curtir.addEventListener("click", () => this.onCurtir());
    }
}

class HistoriaVisualizadaService extends Service {

}

class HistoriaVisualizadaComponent extends Component<HistoriaVisualizadaViewModel, HistoriaVisualizadaService> {

    constructor() {
        super("historia-visualizada");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(HistoriaVisualizadaViewModel, HistoriaVisualizadaService);
        this.viewModel.onCurtir = () => this.dispatchEvent(new Event("curtir"));
        
        this.addEventListener("initializeData", (ev) => {
            const historia: HistoriaModel = (ev as CustomEvent).detail;
            this.viewModel.titulo = historia.titulo;
        });
    }

}

export default HistoriaVisualizadaComponent;