import StorageService from "../services/storage.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class AcessoViewModel extends ViewModel {
    
    private idAtual: HTMLSpanElement = this.getElement("idAtual");
    private tokenAtual: HTMLParagraphElement = this.getElement("tokenAtual");
    private copiar: HTMLButtonElement = this.getElement("copiar");
    private tokenExistente = this.getElement<HTMLInputElement>("tokenExistente");
    private validar = this.getElement<HTMLButtonElement>("validar");
    private utilizar = this.getElement<HTMLButtonElement>("utilizar");

    constructor() {
        super();

        this.tokenAtual.innerText = StorageService.token ?? "";    
    }
}

class AcessoService extends Service {

}

class AcessoComponent extends Component<AcessoViewModel, AcessoService> {

    constructor() {
        super("Acesso");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(AcessoViewModel, AcessoService);
    }

}

export default AcessoComponent;