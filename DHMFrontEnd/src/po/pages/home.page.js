import BasePage from '../../core/base.page.js';

export default class HomePage extends BasePage {
    constructor(page) {
        super(page);
    }

    get shopButton() {
        return this.page.locator('button:has-text("SHOP THE COLLECTION")');
    }

    async open() {
        await super.navigate('/');
    }

    async goToShop() {
        await this.clickElement(this.shopButton);
        await this.page.waitForURL('http://localhost:5173/shop');
    }
}
