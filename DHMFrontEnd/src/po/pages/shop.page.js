import BasePage from '../../core/base.page.js';

export default class ShopPage extends BasePage {
    constructor(page) {
        super(page);
    }

    async open() {
        await super.navigate('/shop');
    }

    async openProductDetails(productName) {
        const productCard = this.page.locator('div', { hasText: productName }).locator('..').locator('..'); // Find the wrapper
        const specificCard = this.page.locator(`text="${productName}"`).locator('xpath=./ancestor::div[contains(@class, "productCard")]');
        
        // Wait and click
        await specificCard.waitFor({ state: 'visible' });
        await specificCard.click();
    }
}
