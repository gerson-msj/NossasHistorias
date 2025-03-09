import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class MinhaHistoriaViewModel extends ViewModel {

    private excluir: HTMLButtonElement;

    public onExcluir = () => { };

    constructor() {
        super();
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
    }

}

export default MinhaHistoriaComponent;