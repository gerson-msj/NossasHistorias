import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class PendentesAprovacaoViewModel extends ViewModel {

    private aprovar: HTMLButtonElement;
    private reprovar: HTMLButtonElement;
    private motivoReprovacao: HTMLInputElement;

    public onAprovar = () => { }
    public onReprovar = (motivoReprovacao: string) => { }

    constructor() {
        super();
        this.aprovar = this.getElement("aprovar");
        this.reprovar = this.getElement("reprovar");
        this.motivoReprovacao = this.getElement("motivoReprovacao");
        
        this.aprovar.addEventListener("click", () => this.onAprovar());
        this.reprovar.addEventListener("click", () => this.onReprovar(this.motivoReprovacao.value));
    }
}

class PendentesAprovacaoService extends Service {

}

class PendentesAprovacaoComponent extends Component<PendentesAprovacaoViewModel, PendentesAprovacaoService> {

    constructor() {
        super("pendentes-aprovacao");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(PendentesAprovacaoViewModel, PendentesAprovacaoService);
        this.viewModel.onAprovar = () => this.dispatchEvent(new Event("aprovar"));
        this.viewModel.onReprovar = (motivoReprovacao: string) => this.dispatchEvent(new Event("reprovar"));
    }

}

export default PendentesAprovacaoComponent;