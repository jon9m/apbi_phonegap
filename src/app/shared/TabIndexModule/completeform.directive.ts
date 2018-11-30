import { Directive, ElementRef, AfterViewInit, Renderer2, HostListener } from "@angular/core";

@Directive({
    selector: '[completeform]'
})
export class CompleteFormDirective implements AfterViewInit {

    constructor(public elem: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit(): void {
    }

    @HostListener('click') clickItem() {
        this.renderer.removeClass(this.elem.nativeElement, 'forminvalidborder');
    }

    getFormCompletionStatus = () => {
        let formCompleted: boolean = false;
        let cells = this.elem.nativeElement.children;
        if (cells) {
            outermost: for (let curr of cells) {
                if (curr) {
                    let chkboxes = curr.children;
                    if (chkboxes) {
                        for (let cbox of chkboxes) {
                            if (cbox) {
                                let inputEls = cbox.children;
                                if (inputEls) {
                                    for (let currChx of inputEls) {
                                        if (currChx) {
                                            if ((currChx.type === 'checkbox') && currChx.checked === true) {
                                                formCompleted = true;
                                                break outermost;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (!formCompleted) {
            if (this.elem.nativeElement) {
                this.renderer.addClass(this.elem.nativeElement, 'forminvalidborder');
            }
        } else {
            if (this.elem.nativeElement) {
                this.renderer.removeClass(this.elem.nativeElement, 'forminvalidborder');
            }
        }

        return formCompleted;
    }
}