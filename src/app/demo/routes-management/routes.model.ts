import { BaseRequest, BaseResponse, SearchBaseRequest, SearchBaseResponse } from 'ngx-fw4c';
import { propertyMap } from './functions/propertyMap';
export class RouteViewModel {
    name: string;
    tags: string;
    hosts: string[];    
    paths: string[];
    @propertyMap('https_redirect_status_code')
    statusCode: number;
    @propertyMap('regex_priority')
    regexPriority: number;
    methods: string[];
    @propertyMap('strip_path')
    stripPath: boolean;
    @propertyMap('preserve_host')
    preserveHost: boolean;
    protocols: string[];
    service: ServiceViewModel;
    id: string; 
    serviceName:string;   
    constructor(init?: Partial<RouteViewModel>) {
        Object.assign(this, init);
        this.statusCode=null;
        this.preserveHost=null;
        this.regexPriority=null;
        this.stripPath=null;
    }
}

export class RouteModelMapping {
    name: string;
    tags: string;
    hosts: string[];    
    paths: string[];
    https_redirect_status_code: number;
    regex_priority: number;
    methods: string[];
    strip_path: boolean;
    preserve_host: boolean;
    protocols: string[];
    service: ServiceViewModel;
    id: string; 
    serviceName:string;   
    constructor(init?: Partial<RouteModelMapping>) {
        Object.assign(this, init);
    }
}

export class ServiceViewModel {
    name?: string;
    Description?: string;
    tags?: string;
    url?: string;
    protocol?: string;
    host?: string;
    port?: number;
    path?: string;
    Retries?: string;
    Connect?: string;
    Write?: string;
    Read?: string;
    id?: string;
    constructor(init?: Partial<ServiceViewModel>) {
        Object.assign(this, init);
    }
}

export class RouteRequest extends BaseRequest<RouteViewModel> {
    token?: string;
    payload: RouteViewModel = new RouteViewModel({});
    constructor(init?: Partial<RouteRequest>) {
        super();
        Object.assign(this, init);
    }
}

export class RouteResponse extends BaseResponse<RouteViewModel> {
    routes?: RouteViewModel;
    token?: string;
    constructor(init?: Partial<RouteResponse>) {
        super();
        Object.assign(this, init);
    }
}

export class RouteSearchRequest extends SearchBaseRequest {
    token?: string;
    constructor(init?: Partial<RouteSearchRequest>) {
        super();
        Object.assign(this, init);
    }
}

export class RouteSearchResponse extends SearchBaseResponse<RouteViewModel> {
    token?: string;
    constructor(init?: Partial<RouteSearchResponse>) {
        super();
        Object.assign(this, init);
    }
}


export class ModelMapper<T> {
    _propertyMapping: any;
    _target: any;
       constructor(type: { new(): T ;}){
          this._target = new type();
          this._propertyMapping = this._target.constructor._propertyMap;
       }
  
       map(source){
         Object.keys(this._target).forEach((key) => {
           const mappedKey = this._propertyMapping[key]
           if(mappedKey){
             this._target[key] = source[mappedKey];
           }
           else {
             this._target[key] = source[key];
           }
         });
         Object.keys(source).forEach((key)=>{
           const targetKeys = Object.keys(this._target);
           if(targetKeys.indexOf(key) === -1){
             this._target[key] = source[key];
           }
         });
        return this._target;
       }
  }