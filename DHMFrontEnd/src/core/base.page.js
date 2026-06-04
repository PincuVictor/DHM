export default class BasePage {
    constructor(page) {
        this.page = page;
    }

    async navigate(path) {
        await this.page.goto(`http://localhost:5173${path}`);
    }

    async clickElement(locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    async enterText(locator, text) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }
}
