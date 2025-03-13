import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class AcessoViewModel extends ViewModel {
    
    constructor() {
        super();
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