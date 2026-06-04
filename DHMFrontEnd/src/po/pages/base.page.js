class BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async navigate(path) {
        await this.page.goto(path);
    }

    /**
     * @param {import('@playwright/test').Locator} locator
     */
    async clickElement(locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.click();
    }

    /**
     * @param {import('@playwright/test').Locator} locator
     * @param {string} text
     */
    async enterText(locator, text) {
        await locator.waitFor({ state: 'visible' });
        await locator.fill(text);
    }
}

module.exports = BasePage;