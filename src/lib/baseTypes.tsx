export type QueryKey = string;

export interface QueryInfo {
  key: QueryKey,
  indices: string,
  body: object,
}

export type OutputItem = string | object;
export type OutputList = OutputItem[];
