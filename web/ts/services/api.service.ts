export default class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = `/api/${baseUrl}`;
    }

    public async doGet<TResult>(searchParams: URLSearchParams | null = null): Promise<TResult> {

        const url = searchParams ? `${this.baseUrl}?${searchParams}` : this.baseUrl;

        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders()
        });

        return this.getResult(response);
    }

    public async doPost<TResult>(obj: object, bearer: string | null = null): Promise<TResult> {

        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(obj)
        });

        const data: TResult = await response.json();
        return data;
    }

    public async doPut<TResult>(request: object): Promise<TResult> {

        const response = await fetch(this.baseUrl, {
            method: "PUT",
            headers: this.getHeaders(),
            body: JSON.stringify(request)
        });

        return this.getResult(response);
    }

    private async getResult<TResult>(response: Response) : Promise<TResult> {
        if(response.ok){
            const data: TResult = await response.json();
            return data;
        } else {
            if(response.status == 401)
                document.dispatchEvent(new Event("unauthorized"));
            
            const error = await response.json();
            console.log("Erro:", error);
            throw new Error(error?.message ?? response.statusText);
        }
    }

    private getHeaders(): Record<string, string> {
        const token = localStorage.getItem("token");
        const headers: Record<string, string> = { "content-type": "application/json; charset=utf-8" };

        if (token !== null)
            headers["authorization"] = `Bearer ${token}`;

        return headers;
    }
}