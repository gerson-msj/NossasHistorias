import { DatabaseSync } from "node:sqlite";

export default abstract class Service {
    private _db?: DatabaseSync;
    public get db(): DatabaseSync { return this._db!; }
    public set db(db: DatabaseSync) { this._db = db; }
}