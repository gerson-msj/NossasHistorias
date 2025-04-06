import { DatabaseSync } from "node:sqlite";
import Context from "./base/context.ts";
import Controller from "./base/controller.ts";
import { HistoriaRequestModel } from "../models/request.model.ts";
import { Situacao } from "../models/db.model.ts";
import DateService from "../services/date.service.ts";
import { ProximaHistoriaResponseModel } from "../models/response.model.ts";

class HistoriaService {
    private db: DatabaseSync;

    constructor(db: DatabaseSync) {
        this.db = db;
    }

    public incluir(idUsuarioAutor: number, request: HistoriaRequestModel): number {
        const sql = "Insert Into Historias (IdUsuarioAutor, Titulo, Conteudo, IdSituacao, DataHoraCriacao) Values (?, ?, ?, ?, ?)";
        const query = this.db.prepare(sql);
        const queryResult = query.run(idUsuarioAutor, request.titulo, request.conteudo, Situacao.analise, DateService.DiaHoraAtual());
        return queryResult.lastInsertRowid as number;
    }

    public proximaHistoria(idUsuario: number, idHistoria?: number): ProximaHistoriaResponseModel | undefined {
        const historia = idHistoria ? this.obterAtual(idUsuario, idHistoria) : this.obterProxima(idUsuario);

        if (historia && !idHistoria)
            this.registrarVisualizacao(idUsuario, historia.id);

        return historia;
    }

    private registrarVisualizacao(idUsuario: number, idHistoria: number) {
        const sql = "Insert into Visualizacoes (IdUsuario, IdHistoria, Curtida) Values (?, ?, 0)";
        const query = this.db.prepare(sql);
        query.run(idUsuario, idHistoria);
    }

    private obterProxima(idUsuario: number): ProximaHistoriaResponseModel | undefined {
        const sql = this.sqlProxima();
        const query = this.db.prepare(sql);
        return query.get(idUsuario) as ProximaHistoriaResponseModel | undefined;
    }

    private obterAtual(idUsuario: number, idHistoria: number): ProximaHistoriaResponseModel | undefined {
        const sql = this.sqlAtual();
        const query = this.db.prepare(sql);
        return query.get(idUsuario, idHistoria) as ProximaHistoriaResponseModel | undefined;
    }

    private sqlProxima(): string {
        return `        
            With cteContagem as (
                Select 
                    h.Id, 
                    Count(v.IdHistoria) as Visualizacoes,
                    Sum(Case When v.Curtida = 1 Then 1 Else 0 End) as Curtidas 
                From 
                    Historias as h 
                    Left Join Visualizacoes as v
                        on v.IdHistoria = h.Id
                Group By
                    h.Id
            ), cteHistorias as (
                Select
                    h.Id as id, 
                    h.Titulo as titulo, 
                    h.Conteudo as conteudo, 
                    Coalesce(v.Curtida, 0) as curtida,
                    c.Visualizacoes as visualizacoes, 
                    c.Curtidas as curtidas
                From 
                    Historias as h
                    Inner Join cteContagem as c
                        on c.Id = h.Id
                    Left Join Visualizacoes as v
                        on v.IdHistoria = h.Id And v.IdUsuario = ?
                    Where 
                        v.IdHistoria is null
                        And h.IdSituacao = 2
            )
            Select 
                *
            From
                cteHistorias
            Limit
                1
            Offset 
                Coalesce(abs(random()) % (Select Count(*) From cteHistorias), 0)
            ;
        `;
    }

    private sqlAtual(): string {
        return `        
            With cteContagem as (
                Select 
                    h.Id, 
                    Count(v.IdHistoria) as Visualizacoes,
                    Sum(Case When v.Curtida = 1 Then 1 Else 0 End) as Curtidas 
                From 
                    Historias as h 
                    Left Join Visualizacoes as v
                        on v.IdHistoria = h.Id
                Group By
                    h.Id
            )
            Select
                h.Id as id, 
                h.Titulo as titulo, 
                h.Conteudo as conteudo, 
                Coalesce(v.Curtida, 0) as curtida,
                c.Visualizacoes as visualizacoes, 
                c.Curtidas as curtidas
            From 
                Historias as h
                Inner Join cteContagem as c
                    on c.Id = h.Id
                Left Join Visualizacoes as v
                        on v.IdHistoria = h.Id And v.IdUsuario = ?
            Where 
                h.Id = ?
            ;
        `;
    }
}

export default class HistoriaController extends Controller<HistoriaService> {

    public override async handle(context: Context): Promise<Response> {

        if (context.url.pathname != "/api/historia")
            return this.nextHandle(context);

        if (["GET", "POST"].includes(context.request.method)) {
            const db = await context.openDb();
            this.service = new HistoriaService(db);
        }

        if (context.tokenSub === null)
            return context.unauthorized();

        switch (context.request.method) {
            case "GET": {
                const request = context.getSearchParam("idHistoria");
                const idHistoria = request ? parseInt(request) : undefined;
                const response = this.service.proximaHistoria(context.tokenSub, idHistoria);
                return context.ok(response);
            }

            case "POST": {
                const request: HistoriaRequestModel = await context.request.json();
                this.service.incluir(context.tokenSub, request);
                return context.ok({});
            }

            default: {
                return context.notAllowed();
            }
        }

    }

}
