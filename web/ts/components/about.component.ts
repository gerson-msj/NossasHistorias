import { headerVoltarClick } from "../models/const.model";
import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class AboutViewModel extends ViewModel {

}

class AboutService extends Service {
    
}

class AboutComponent extends Component<AboutViewModel, AboutService> {

    constructor() {
        super("about");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(AboutViewModel, AboutService);
        this.addEventListener(headerVoltarClick, () =>
            this.dispatchEvent(new Event("voltar")));
    }

}

export default AboutComponent;