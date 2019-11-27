import { ElementRef } from "@angular/core";
import { DefaultLayoutService } from './layout.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionService } from '../shared/services/action.service';
import { NotificationDetail } from '../shared/models/notification.model';
import { UserViewModel } from '../auth/auth.model';
import { AggregatorService } from '../shared/services/aggregator.service';
import { AuthenticationService } from '../auth/auth.service';
import { MenuTab, ExtendedMainMenuGroup, MenuItem } from '../shared/models/base.model';
import { MenuService } from '../shared/services/menu.service';
export declare class DefaultHeaderComponent {
    layoutService: DefaultLayoutService;
    protected router: Router;
    protected route: ActivatedRoute;
    protected actionService: ActionService;
    protected aggregatorService: AggregatorService;
    protected authenticationService: AuthenticationService;
    protected menuService: MenuService;
    private _aggregatorService;
    notifications: NotificationDetail[];
    logo: string;
    title: string;
    menuType: string;
    set: (role: string) => MenuItem;
    menuTabs: MenuTab[];
    menu: ElementRef;
    loading: boolean;
    filter: string;
    user: UserViewModel;
    isMobile: boolean;
    currentUrl: string;
    menuItems: ExtendedMainMenuGroup[];
    isCollapsedSideBar: string;
    isSupplier: boolean;
    tabs: {
        name: string;
        menu: string;
        subName: string;
    }[];
    selectedMenu: ExtendedMainMenuGroup;
    constructor(layoutService: DefaultLayoutService, router: Router, route: ActivatedRoute, actionService: ActionService, aggregatorService: AggregatorService, authenticationService: AuthenticationService, menuService: MenuService, _aggregatorService: AggregatorService);
    ngOnInit(): void;
    toggleMenu(): void;
    logout(): void;
    selectItem(item: ExtendedMainMenuGroup): void;
    getParentLink(item: ExtendedMainMenuGroup): string;
    getChildLink(item: any): string;
    selectSubMenu(child: MenuItem): void;
    private registerEvents;
    private initMenu;
    private setMenu;
}
