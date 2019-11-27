import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationLoginRequest, AuthenticationLoginResponse, UserViewModel, AuthenticationSearchRequest, AuthenticationSearchResponse, AuthenticationRetrieveRequest, AuthenticationRetrieveResponse, AuthenticationCreateRequest, AuthenticationCreateResponse, AuthenticationUpdateRequest, AuthenticationUpdateResponse, AuthenticationDeleteRequest, AuthenticationDeleteResponse } from './auth.model';
import { CacheService } from '../shared/services/cache.service';
import { Router } from '@angular/router';
import { MockService } from '../shared/services/mock.service';
import { MenuTab } from '../shared/models/base.model';
export declare class AuthenticationService extends MockService {
    protected httpClient: HttpClient;
    private _cacheService;
    private _router;
    currentUser: UserViewModel;
    protected menuTabs: MenuTab[];
    constructor(httpClient: HttpClient, _cacheService: CacheService, _router: Router);
    setApi(url: string): void;
    getApi(): string;
    search(request: AuthenticationSearchRequest): Observable<AuthenticationSearchResponse>;
    retrieve(request: AuthenticationRetrieveRequest): Observable<AuthenticationRetrieveResponse>;
    login(request: AuthenticationLoginRequest): Observable<AuthenticationLoginResponse>;
    create(request: AuthenticationCreateRequest): Observable<AuthenticationCreateResponse>;
    update(request: AuthenticationUpdateRequest): Observable<AuthenticationUpdateResponse>;
    delete(request: AuthenticationDeleteRequest): Observable<AuthenticationDeleteResponse>;
    logout(path?: string, refresh?: boolean): void;
}
