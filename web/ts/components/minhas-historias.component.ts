import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class MinhasHistoriasViewModel extends ViewModel {

    constructor() {
        super();
    }
}

class MinhasHistoriasService extends Service {

}

class MinhasHistoriasComponent extends Component<MinhasHistoriasViewModel, MinhasHistoriasService> {

    constructor() {
        super("minhas-historias");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(MinhasHistoriasViewModel, MinhasHistoriasService);
    }

}

export default MinhasHistoriasComponent;