import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabIndexDirective } from './tabItem.directive';
import { CompleteFormDirective } from './completeform.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [TabIndexDirective, CompleteFormDirective],
    providers: [],
    exports: [TabIndexDirective, CompleteFormDirective]
})
export class TabIndexModule { }