import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class NovaHistoriaViewModel extends ViewModel {
    constructor() {
        super();
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
    }

}

export default NovaHistoriaComponent;