import { Directive, Input, ElementRef, AfterViewInit } from "@angular/core";

@Directive({
    selector: '[completeform]'
})
export class CompleteFormDirective implements AfterViewInit {

    constructor(public elem: ElementRef) { }

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
        return formCompleted;
    }
}