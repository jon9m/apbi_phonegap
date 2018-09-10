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
        destElem.style.backgroundColor = '#21a8d7';
        destElem.style.top = posSrcPx;

        destElem.style.left = '50%';

        let offsetWidthHalf: number = destElem.offsetWidth / 2;
        offsetWidthHalf = Number(offsetWidthHalf.toFixed(0));
        offsetWidthHalf = offsetWidthHalf * -1;
        destElem.style.marginLeft = offsetWidthHalf + 'px';
    }

    public static removeStyleFromDestination(destElem) {
        destElem.style.position = 'unset';
        destElem.style.zIndex = 'auto';
        destElem.style.backgroundColor = 'inherit';
        destElem.style.top = 'auto';
        destElem.style.left = 'auto';
        destElem.style.marginLeft = 'auto';
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
}