import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabIndexDirective } from './tabItem.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [TabIndexDirective],
    providers: [],
    exports: [TabIndexDirective]
})
export class TabIndexModule { }