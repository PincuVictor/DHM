import BasePage from '../../core/base.page.js';

export default class NavbarComponent extends BasePage {
    constructor(page) {
        super(page);
    }

    get cartLink() {
        return this.page.locator('.cart-container');
    }

    async goToCart() {
        await this.page.goto('http://localhost:5173/cart');
    }
}