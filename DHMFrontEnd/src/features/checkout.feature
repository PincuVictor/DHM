@e2e @checkout
Feature: Order Checkout

  Scenario: Successful checkout process
    Given I navigate to the login page
    And I login with "test@dhm.com" and "Testing!23"
    And I navigate to the shop and add the "The Block" product to my cart
    When I navigate to the cart and proceed through all checkout steps
    And I enter my payment details and finish
    Then I should see a successful payment message
