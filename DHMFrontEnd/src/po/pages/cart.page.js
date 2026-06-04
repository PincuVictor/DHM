import BasePage from '../../core/base.page.js';

export default class CartPage extends BasePage {
    constructor(page) {
        super(page);
    }

    get checkoutButton() {
        return this.page.locator('button:has-text("Proceed to Checkout")');
    }

    async open() {
        await super.navigate('/cart');
    }

    async proceedToCheckout() {
        await this.clickElement(this.checkoutButton);
        await this.page.waitForURL('http://localhost:5173/checkout');
    }
}
