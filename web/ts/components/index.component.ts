import Component from "./base/component";
import Service from "./base/service";
import ViewModel from "./base/viewmodel";

class IndexViewModel extends ViewModel {
    private about: HTMLButtonElement;
    public onAbout = () => {};
    
    constructor() {
        super();
        this.about = this.getElement("about");
        this.about.addEventListener("click", () => this.onAbout());
    }
}

class IndexService extends Service {
    
}

class IndexComponent extends Component<IndexViewModel, IndexService> {

    constructor() {
        super("index");
    }

    async initialize(): Promise<void> {
        await this.initializeResources(IndexViewModel, IndexService);
        this.viewModel.onAbout = () => 
            this.dispatchEvent(new Event("about"));
    }

}

export default IndexComponent;