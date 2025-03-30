import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class PendentesAprovacaoViewModel extends ViewModel {

    private aprovar: HTMLButtonElement;
    private reprovar: HTMLButtonElement;
    public dialog: DialogComponent | undefined;

    public onAprovar = () => { }
    public onReprovar = () => { }

    constructor() {
        super();
        this.aprovar = this.getElement("aprovar");
        this.reprovar = this.getElement("reprovar");
        
        this.aprovar.addEventListener("click", () => this.onAprovar());
        this.reprovar.addEventListener("click", () => this.onReprovar());
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
        this.viewModel.dialog = await DialogComponent.load(this);
        
        this.viewModel.onAprovar = () => this.dispatchEvent(new Event("aprovar"));
        this.viewModel.onReprovar = () => this.dispatchEvent(new Event("reprovar"));
    }

}

export default PendentesAprovacaoComponent;