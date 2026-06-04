import BasePage from '../../core/base.page.js';

export default class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
    }

    // Shipping Details
    get addressInput() { return this.page.locator('input[name="addressLine1"]'); }
    get cityInput() { return this.page.locator('input[name="city"]'); }
    get zipInput() { return this.page.locator('input[name="postalCode"]'); }
    get countryInput() { return this.page.locator('input[name="country"]'); }
    get addNewAddressBtn() { return this.page.locator('button:has-text("+ Add New Address")'); }
    get continueToPaymentBtn() { return this.page.locator('button:has-text("Proceed to Payment")'); }

    // Payment Details
    get cardNumberInput() { return this.page.locator('input[name="number"]'); }
    get cardExpiryInput() { return this.page.locator('input[name="expiry"]'); }
    get cardCvcInput() { return this.page.locator('input[name="cvc"]'); }
    get cardNameInput() { return this.page.locator('input[name="name"]'); }
    get payButton() { return this.page.locator('button[type="submit"]'); }

    get successMessage() { return this.page.locator('text="Payment Successful!"'); }

    async fillShippingDetails(details) {
        await Promise.race([
            this.addressInput.waitFor({ state: 'visible' }),
            this.addNewAddressBtn.waitFor({ state: 'visible' })
        ]);

        if (await this.addNewAddressBtn.isVisible()) {
            await this.clickElement(this.addNewAddressBtn);
        }
        
        await this.enterText(this.addressInput, details.addressLine1);
        await this.enterText(this.cityInput, details.city);
        await this.enterText(this.zipInput, details.postalCode);
        await this.enterText(this.countryInput, details.country);
        
        await this.clickElement(this.continueToPaymentBtn);
        await this.page.waitForURL(/\/payment/);
    }

    async fillPaymentDetailsAndSubmit(payment) {
        await this.enterText(this.cardNumberInput, payment.cardNumber);
        await this.enterText(this.cardExpiryInput, payment.expiry);
        await this.enterText(this.cardCvcInput, payment.cvc);
        await this.enterText(this.cardNameInput, payment.name);
        
        await this.clickElement(this.payButton);
    }
}
