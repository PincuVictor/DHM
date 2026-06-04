@e2e @login
Feature: User Authentication

  @smoke
  Scenario: Existing user logs in with valid credentials
    Given I navigate to the login page
    When I login with "test@dhm.com" and "Testing!23"
    Then I should be redirected to the home page
