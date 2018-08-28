import { Directive, Input, ElementRef, AfterViewInit } from "@angular/core";

@Directive({
    selector: '[tabIndexItem]'
})
export class TabIndexDirective implements AfterViewInit {

    @Input() tabIndexItem: string = '';

    constructor(public elem: ElementRef) {

    }

    ngAfterViewInit(): void {
    }
}