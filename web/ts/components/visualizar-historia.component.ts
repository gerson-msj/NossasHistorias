import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class VisualizarHistoriaViewModel extends ViewModel {

    private salvar: HTMLButtonElement;

    public onSalvar = () => { };

    constructor() {
        super();
        this.salvar = this.getElement("salvar");
        this.salvar.addEventListener("click", () => this.onSalvar());
    }
}

class VisualizarHistoriaService extends Service {

}

class VisualizarHistoriaComponent extends Component<VisualizarHistoriaViewModel, VisualizarHistoriaService> {

    constructor() {
        super("visualizar-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(VisualizarHistoriaViewModel, VisualizarHistoriaService);
        this.viewModel.onSalvar = () => this.dispatchEvent(new Event("salvar"));
    }

}

export default VisualizarHistoriaComponent;