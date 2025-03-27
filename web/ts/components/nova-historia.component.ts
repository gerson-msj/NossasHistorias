import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class NovaHistoriaViewModel extends ViewModel {

    private tituloNovaHistoria: HTMLInputElement;
    private novaHistoria: HTMLTextAreaElement;
    private visualizar: HTMLButtonElement;

    public onVisualizar = () => { };

    constructor() {
        super();

        this.tituloNovaHistoria = this.getElement("tituloNovaHistoria");
        this.novaHistoria = this.getElement("novaHistoria");
        this.visualizar = this.getElement("visualizar");

        this.visualizar.addEventListener("click", () => {
            localStorage.setItem(this.tituloNovaHistoria.id, this.tituloNovaHistoria.value);
            localStorage.setItem(this.novaHistoria.id, this.novaHistoria.value);
            this.onVisualizar();
        });

        this.tituloNovaHistoria.focus();

        this.restoreData(this.tituloNovaHistoria, this.novaHistoria);

        this.tituloNovaHistoria.addEventListener("keyup", this.saveData);
        this.novaHistoria.addEventListener("keyup", this.saveData);
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
    }



}

export default NovaHistoriaComponent;