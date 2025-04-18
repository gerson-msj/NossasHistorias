import ApiService from "../services/api.service";
import StorageService from "../services/storage.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IntroViewModel extends ViewModel {

    private entrar: HTMLButtonElement;

    public onEntrar = () => { };

    constructor() {
        super();
        this.entrar = this.getElement("entrar");
        this.entrar.addEventListener("click", () => this.onEntrar());
    }
}

class IntroService extends Service {
    private apiUsuario: ApiService;

    constructor() {
        super();
        this.apiUsuario = new ApiService("usuario");
    }

    public async obterToken(): Promise<string> {
        const result = await this.apiUsuario.doPost<{ token: string }>({});
        return result.token;
    }
}

class IntroComponent extends Component<IntroViewModel, IntroService> {

    constructor() {
        super("intro");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(IntroViewModel, IntroService);

        this.viewModel.onEntrar = () =>
            this.dispatchEvent(new Event("entrar"));

        if (!this.validarTokenSubject()) {
            const token = await this.service.obterToken();
            StorageService.token = token;
        }
    }

}

export default IntroComponent;