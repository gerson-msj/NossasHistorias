import ApiService from "../services/api.service";
import ComponentService from "../services/component.service";
import TokenService from "../services/token.service";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";
import DialogComponent from "./dialog.component";

class IntroViewModel extends ViewModel {
    
    private entrar: HTMLButtonElement;
    private dialog: DialogComponent;
    
    public onEntrar = () => { };

    constructor() {
        super();
        this.entrar = this.getElement("entrar");
        this.entrar.addEventListener("click", () => this.onEntrar());
        
        this.dialog = ComponentService.loadDialog();
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
        
        // if (!this.validarTokenSubject()) {
        //     const token = await this.service.obterToken();
        //     localStorage.setItem("token", token);
        // }
    }

}

export default IntroComponent;