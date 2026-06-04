import BasePage from '../../core/base.page.js';

export default class ProductPage extends BasePage {
    constructor(page) {
        super(page);
    }

    get addToCartButton() {
        return this.page.locator('button:has-text("Add to Cart")');
    }

    async addToCart() {
        const responsePromise = this.page.waitForResponse(response => response.url().includes('/api/Cart') && (response.status() === 200 || response.status() === 201));
        await this.clickElement(this.addToCartButton);
        await responsePromise;
    }
}
