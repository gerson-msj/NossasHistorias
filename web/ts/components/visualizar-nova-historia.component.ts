import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class VisualizarNovaHistoriaViewModel extends ViewModel {

    private salvar: HTMLButtonElement;

    public onSalvar = () => { };

    constructor() {
        super();
        this.salvar = this.getElement("salvar");
        this.salvar.addEventListener("click", () => this.onSalvar());
    }
}

class VisualizarNovaHistoriaService extends Service {

}

class VisualizarNovaHistoriaComponent extends Component<VisualizarNovaHistoriaViewModel, VisualizarNovaHistoriaService> {

    constructor() {
        super("visualizar-nova-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(VisualizarNovaHistoriaViewModel, VisualizarNovaHistoriaService);
        this.viewModel.onSalvar = () => this.dispatchEvent(new Event("salvar"));
    }

}

export default VisualizarNovaHistoriaComponent;