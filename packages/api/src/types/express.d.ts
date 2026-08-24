declare module 'express' {
  export interface Request {
    params: Record<string, any>;
    query: Record<string, any>;
    body: any;
    headers: Record<string, any>;
    url: string;
    method: string;
    validatedQuery?: any;
    validatedBody?: any;
    validatedParams?: any;
  }

  export interface Response {
    status(code: number): this;
    json(body: any): this;
    send(body: any): this;
    setHeader(name: string, value: any): this;
  }

  export type NextFunction = (err?: any) => void;

  export interface Router {
    use(...handlers: any[]): this;
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    put(path: string, ...handlers: any[]): this;
    delete(path: string, ...handlers: any[]): this;
    patch(path: string, ...handlers: any[]): this;
  }

  export function Router(): Router;
}
