export interface ConfigeDB{
  host:string,
  port:string,
  databaseName:string,
  user:string,
  password:string
}
export interface CompareRequest {
  db1: ConfigeDB;
  db2: ConfigeDB;
  tablesToCompare?: string[];
}