import { Directive, ElementRef, AfterViewInit, Renderer2 } from "@angular/core";

@Directive({
    selector: '[completeform]'
})
export class CompleteFormDirective implements AfterViewInit {

    constructor(public elem: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit(): void {
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
        // console.log('this.formCompleted ' + formCompleted);

        if (!formCompleted) {
            if (this.elem.nativeElement.parentNode && this.elem.nativeElement.parentNode.parentNode && this.elem.nativeElement.parentNode.parentNode.parentNode) {
                this.renderer.setStyle(this.elem.nativeElement.parentNode.parentNode.parentNode, 'border', '2px solid #f86c6b');
            }
        } else {
            if (this.elem.nativeElement.parentNode && this.elem.nativeElement.parentNode.parentNode && this.elem.nativeElement.parentNode.parentNode.parentNode) {
                this.renderer.removeStyle(this.elem.nativeElement.parentNode.parentNode.parentNode, 'border');
            }
        }

        return formCompleted;
    }
}