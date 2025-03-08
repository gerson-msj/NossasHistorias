import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class NovaHistoriaViewModel extends ViewModel {

    private visualizar: HTMLButtonElement;

    public onVisualizar = () => { };

    constructor() {
        super();

        this.visualizar = this.getElement("visualizar");

        this.visualizar.addEventListener("click", () => 
            this.onVisualizar());
    }
}

class NovaHistoriaService extends Service {

}

class NovaHistoriaComponent extends Component<NovaHistoriaViewModel, NovaHistoriaService> {

    constructor() {
        super("nova-historia");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(NovaHistoriaViewModel, NovaHistoriaService);
        this.viewModel.onVisualizar = () => this.dispatchEvent(new Event("visualizar"));
        //this.dispatch(this.viewModel.onVisualizar, "visualizar");
    }



}

export default NovaHistoriaComponent;