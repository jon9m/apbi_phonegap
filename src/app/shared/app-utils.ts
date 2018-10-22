import { FormGroup, FormArray, FormControl } from "@angular/forms";
declare var navigator: any;

export class AppUtils {
    static isDisplayed: boolean = true;
    static isClickEventInitialized: boolean = false;

    public static sidebarMinimizerHandler() {
        var clickElem = <HTMLElement>document.querySelector("button[class='sidebar-minimizer']");
        var minimizerElem = <HTMLElement>document.querySelector('app-sidebar-nav');

        if (minimizerElem) {
            let sidebarWidth = minimizerElem.offsetWidth;
            this.isDisplayed = ((sidebarWidth > 50) ? true : false);
            if (!this.isClickEventInitialized && clickElem) {
                this.isClickEventInitialized = true;
                clickElem.addEventListener("click", (event: Event) => {
                    this.isDisplayed = !this.isDisplayed;

                    this.breadcrumbWidthHandler(false, false);
                });
            }
        }
    }

    public static navbarTogglerhandler() {
        var appHeaderElem = <HTMLElement>document.querySelector('.app-header');
        if (appHeaderElem) {
            appHeaderElem.addEventListener("click", (event: Event) => {
                setTimeout(() => {
                    this.breadcrumbWidthHandler(true, false);
                }, 500);
            });
        }
    }

    public static resetClickEventInitializedState() {
        AppUtils.isClickEventInitialized = false;
    }

    getDisplay() {
        return AppUtils.isDisplayed;
    }

    //Breadcrumb bar width handler

    public static breadcrumbWidthHandler(init, resize) {
        var contentviewElem = <HTMLElement>document.querySelector('#pagecontentview');
        var breadcrumbElem = <HTMLElement>document.querySelector('.breadcrumb');

        if (contentviewElem && breadcrumbElem) {
            if (init) {
                breadcrumbElem.style.width = contentviewElem.offsetWidth + 'px';
            } else {
                if (this.isDisplayed) {
                    if (resize) {
                        breadcrumbElem.style.width = contentviewElem.offsetWidth + 'px';
                    } else {
                        breadcrumbElem.style.width = contentviewElem.offsetWidth - 150 + 'px';
                    }
                } else {
                    if (resize) {
                        breadcrumbElem.style.width = contentviewElem.offsetWidth + 'px';
                    } else {
                        breadcrumbElem.style.width = contentviewElem.offsetWidth + 150 + 'px';
                    }
                }
            }
        }
    }

    public static moveToPosition(srcElem, destid) {
        var destElem = <HTMLElement>document.querySelector('#' + destid);

        var posSrc = this.findPos(srcElem);
        var posSrcPx = (Number(posSrc[0]) + 160) + 'px';

        //styles
        this.addStyleToDestination(destElem, posSrcPx);
    }

    public static resetPosition(destid) {
        var destElem = <HTMLElement>document.querySelector('#' + destid);

        //reset styles
        this.removeStyleFromDestination(destElem);
    }


    public static addStyleToDestination(destElem, posSrcPx) {
        destElem.style.position = 'absolute';
        destElem.style.zIndex = '1000';
        destElem.style.top = posSrcPx;

        if (this.isMobile()) {
            destElem.style.marginRight = '30px';
        } else {
            let formViewHalfWidth = (<HTMLElement>document.querySelector('#pagecontentview')).offsetWidth / 2;
            let quickViewHalfWidth = destElem.offsetWidth / 2;
            destElem.style.marginLeft = (formViewHalfWidth - quickViewHalfWidth).toFixed(0) + 'px';
        }
    }

    public static isMobile() {
        if (navigator.camera) { //Check!
            return true;
        }
        return false;
    }

    public static removeStyleFromDestination(destElem) {
        destElem.style.position = 'unset';
        destElem.style.zIndex = 'auto';
        destElem.style.top = 'auto';
        destElem.style.left = 'auto';
        destElem.style.marginLeft = 'auto';
        destElem.style.marginRight = 'auto';
    }

    public static findPos(obj) {
        var curtop = -100;
        if (obj && obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
            return [curtop];
        }
    }

    public static addControlsToForm(form: FormGroup, controls: {}) {
        Object.entries(controls).forEach(([key, value]) => {
            if (value instanceof Array) {
                form.addControl(key, new FormArray([]));
            } else {
                form.addControl(key, new FormControl(value));
            }
        });
    }

    public static addControlsToDynamicForm(form: FormGroup, controls: {}, index: number) {
        Object.entries(controls).forEach(([key, value]) => {
            if (value instanceof Array) {
                form.addControl((key + '_' + index), new FormArray([]));
            } else {
                form.addControl((key + '_' + index), new FormControl(value));
            }
        });
    }

    public static getNumberForItemValue(itemValue): number {
        let numbers = ['One', 'Two', 'Three', 'Four', 'Five'];
        return numbers.indexOf(itemValue);
    }

    public static toggleDisableSelectElements(disable: boolean, elType: string, recommPopupId: string) {
        let destElem: HTMLElement = <HTMLElement>document.getElementById(recommPopupId);
        if (destElem) {
            let selects = (<HTMLElement>destElem).getElementsByTagName(elType);
            if (selects) {
                for (let index = 0; index < selects.length; index++) {
                    if (elType === 'select') {
                        const element = selects[index];
                        (<HTMLSelectElement>element).disabled = disable;
                    }
                }
            }
        }
    }
}