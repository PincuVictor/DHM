import BasePage from '../../core/base.page.js';

export default class LoginPage extends BasePage {
    constructor(page) {
        super(page);
    }

    get emailInput() {
        return this.page.locator('input[id="email"]');
    }
    
    get passwordInput() {
        return this.page.locator('input[id="password"]');
    }
    
    get loginButton() {
        return this.page.locator('button[type="submit"]');
    }

    async open() {
        await super.navigate('/login');
    }

    async login(email, password) {
        await this.enterText(this.emailInput, email);
        await this.enterText(this.passwordInput, password);
        await this.clickElement(this.loginButton);
    }
}