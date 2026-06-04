@e2e @register
Feature: User Registration

  @smoke
  Scenario: Visitor registers a new customer account
    Given I navigate to the register page
    When I fill out the registration form with valid data
    Then I should be prompted to verify my email
