@e2e @cart
Feature: Shopping Cart Management

  @smoke
  Scenario: Adding a product to the basket
    Given I navigate to the login page
    And I login with "test@dhm.com" and "Testing!23"
    When I navigate to the shop and add the "The Block" product to my cart
    Then the cart badge should update
