import { HistoriaModel } from "../models/model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class MinhasHistoriasViewModel extends ViewModel {

    private rowTemplate: HTMLDivElement;

    constructor() {
        super();

        this.rowTemplate = this.getElement("rowTemplate");
    }
}

class MinhasHistoriasService extends Service {
    public obterMinhasHistorias() : Promise<HistoriaModel[]> {
        const historias: HistoriaModel[] = [
            {
                titulo = ""
            }
        ];
    }
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