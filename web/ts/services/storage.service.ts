export default class StorageService {

    private static currentComponentKey = btoa("currentComponentName");
    public static get currentComponent(): string { return atob(localStorage.getItem(this.currentComponentKey) ?? ""); }
    public static set currentComponent(v: string) { localStorage.setItem(this.currentComponentKey, btoa(v)); }

    private static tokenKey = btoa("token");
    public static get token(): string | null { return localStorage.getItem(this.tokenKey); }
    public static set token(v: string) { localStorage.setItem(this.tokenKey, v); }

    private static index_idHistoriaKey = btoa("index_idHistoria");
    public static get index_idHistoria(): number | undefined { const v = localStorage.getItem(this.index_idHistoriaKey); return v ? parseInt(atob(v)) : undefined; }
    public static set index_idHistoria(v: number | undefined) { v ? localStorage.setItem(this.index_idHistoriaKey, btoa(v.toString())) : localStorage.removeItem(this.index_idHistoriaKey); }


}