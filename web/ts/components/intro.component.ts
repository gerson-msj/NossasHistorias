import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IntroViewModel extends ViewModel {
    private entrar: HTMLButtonElement;
    public onEntrar = () => {};
    
    constructor() {
        super();
        this.entrar = this.getElement("entrar");
        this.entrar.addEventListener("click", () => this.onEntrar());
    }
}

class IntroService extends Service {
    
}

class IntroComponent extends Component<IntroViewModel, IntroService> {

    constructor() {
        super("intro");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(IntroViewModel, IntroService);
        this.viewModel.onEntrar = () => 
            this.dispatchEvent(new Event("entrar"));
        //localStorage.setItem("intro", "true");
    }

}

export default IntroComponent;