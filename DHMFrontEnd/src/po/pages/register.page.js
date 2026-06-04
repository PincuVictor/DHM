import BasePage from '../../core/base.page.js';

export default class RegisterPage extends BasePage {
    constructor(page) {
        super(page);
    }

    get emailInput() { return this.page.locator('input[id="email"]'); }
    get firstNameInput() { return this.page.locator('input[id="firstName"]'); }
    get lastNameInput() { return this.page.locator('input[id="lastName"]'); }
    get passwordInput() { return this.page.locator('input[id="password"]'); }
    get passwordConfirmInput() { return this.page.locator('input[id="password2"]'); }
    get submitButton() { return this.page.locator('button[type="submit"]'); }
    get verifyHeading() { return this.page.locator('h2:has-text("VERIFY EMAIL")'); }

    async open() {
        await super.navigate('/signup');
    }

    async register(details) {
        await this.enterText(this.emailInput, details.email);
        await this.enterText(this.firstNameInput, details.firstName);
        await this.enterText(this.lastNameInput, details.lastName);
        await this.enterText(this.passwordInput, details.password);
        await this.enterText(this.passwordConfirmInput, details.passwordConfirm);
        await this.clickElement(this.submitButton);
    }
}
