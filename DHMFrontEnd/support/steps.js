import { BeforeAll, AfterAll, Before, After, Given, When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, firefox, webkit } from '@playwright/test';
import { expect } from '@playwright/test';

import LoginPage from '../src/po/pages/login.page.js';
import RegisterPage from '../src/po/pages/register.page.js';
import HomePage from '../src/po/pages/home.page.js';
import ShopPage from '../src/po/pages/shop.page.js';
import CartPage from '../src/po/pages/cart.page.js';
import CheckoutPage from '../src/po/pages/checkout.page.js';
import NavbarComponent from '../src/po/components/navbar.component.js';

setDefaultTimeout(30 * 1000);

let browser;

BeforeAll(async function () {
    const browserName = process.env.BROWSER || 'chromium';
    console.log(`Launching ${browserName}...`);
    switch (browserName) {
        case 'firefox': browser = await firefox.launch({ headless: true }); break;
        case 'webkit': browser = await webkit.launch({ headless: true }); break;
        default: browser = await chromium.launch({ headless: true });
    }
});

Before(async function () {
    this.context = await browser.newContext({
        baseURL: 'http://localhost:5173',
        viewport: { width: 1280, height: 720 }
    });
    this.page = await this.context.newPage();

    this.loginPage = new LoginPage(this.page);
    this.registerPage = new RegisterPage(this.page);
    this.homePage = new HomePage(this.page);
    this.shopPage = new ShopPage(this.page);
    this.cartPage = new CartPage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
    this.navbar = new NavbarComponent(this.page);
});

After(async function () {
    await this.page.close();
    await this.context.close();
});

AfterAll(async function () {
    await browser.close();
});

// --- Scenarios Step Definitions --- //

// 1. Existing user logs in
Given('I navigate to the login page', async function () {
    await this.loginPage.open();
});

When('I login with {string} and {string}', async function (email, password) {
    await this.loginPage.login(email, password);
});

Then('I should be redirected to the home page', async function () {
    await this.page.waitForURL('http://localhost:5173/');
    expect(this.page.url()).toBe('http://localhost:5173/');
});

// 2. Register
Given('I navigate to the register page', async function () {
    await this.registerPage.open();
});

When('I fill out the registration form with valid data', async function () {
    await this.registerPage.register({
        email: `test_${Date.now()}@test.com`,
        firstName: 'Test',
        lastName: 'User',
        password: 'Password123!',
        passwordConfirm: 'Password123!'
    });
});

Then('I should be prompted to verify my email', async function () {
    await this.registerPage.verifyHeading.waitFor({ state: 'visible' });
    expect(await this.registerPage.verifyHeading.isVisible()).toBeTruthy();
});

// 3. Add to cart
Given('I navigate to the home page', async function () {
    await this.homePage.open();
});

When('I navigate to the shop and add the {string} product to my cart', async function (productName) {
    await this.homePage.goToShop();
    await this.shopPage.openProductDetails(productName);
    
    // Lazy load the ProductPage as it wasn't instantiated in Before
    if (!this.productPage) {
        const ProductPage = (await import('../src/po/pages/product.page.js')).default;
        this.productPage = new ProductPage(this.page);
    }
    
    await this.productPage.addToCart();
});

Then('the cart badge should update', async function () {
    await this.navbar.goToCart();
    // Using a more robust selector just in case styles.cartItem gets mangled
    const cartItemsCount = await this.page.locator('xpath=//div[contains(@class, "cartItem")]').count();
    // Just to ensure it doesn't fail on counting 0 if rendering takes a sec
    await this.page.waitForSelector('xpath=//div[contains(@class, "cartItem")]', { state: 'visible', timeout: 10000 });
});

// 4. Checkout
When('I navigate to the cart and proceed through all checkout steps', async function () {
    await this.navbar.goToCart();
    await this.cartPage.proceedToCheckout();
    
    await this.checkoutPage.fillShippingDetails({
        addressLine1: '123 Test St',
        city: 'Testville',
        postalCode: '12345',
        country: 'Testland'
    });
});

When('I enter my payment details and finish', async function () {
    await this.checkoutPage.fillPaymentDetailsAndSubmit({
        cardNumber: '4242 4242 4242 4242',
        expiry: '12/26',
        cvc: '123',
        name: 'Test User'
    });
});

Then('I should see a successful payment message', async function () {
    await this.checkoutPage.successMessage.waitFor({ state: 'visible', timeout: 10000 });
    expect(await this.checkoutPage.successMessage.isVisible()).toBeTruthy();
});