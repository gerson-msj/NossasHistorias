import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class VisualizarNovaHistoriaViewModel extends ViewModel {

    private tituloNovaHistoria: HTMLElement;
    private novaHistoria: HTMLElement;

    private salvar: HTMLButtonElement;

    public onSalvar = () => { };

    constructor() {
        super();
        
        this.tituloNovaHistoria = this.getElement("tituloNovaHistoria");
        this.novaHistoria = this.getElement("novaHistoria");
        
        this.restoreData(this.tituloNovaHistoria, this.novaHistoria);

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
        
        const dialog = await DialogComponent.load(this);
                
        this.viewModel.onSalvar = () => this.dispatchEvent(new Event("salvar"));
    }

}

export default VisualizarNovaHistoriaComponent;