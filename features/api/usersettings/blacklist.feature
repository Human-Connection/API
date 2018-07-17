Feature: Individual Blacklist
  As a user
  I want to click on a button to blacklist certain user profiles
  In order to stop seeing user content of this account, because I don't like them

  Background:
    Given this is your user account:
      | email            | password | isVerified |
      | user@example.com |     1234 | true       |
    And these user accounts exist:
       | name  | email              | isVerified |
       | Troll | troll@example.com  | true       |
       | Legit | legit@example.com  | true       |
    And you are authenticated


  Scenario: Blacklist a user
    When you create your user settings via POST request to "/usersettings" with:
    """
    {
      "blacklist": ["5b5863e8d47c14323165718b"]
    }
    """
    Then you will stop seeing posts of the user with id "5b5863e8d47c14323165718b"

  Scenario: Filter out contributions of a blacklisted user
    Given you blacklisted the user "Troll" before
    When this user publishes a post
    And you read your current news feed
    Then this post is not included

  Scenario: Show but conceal comments of a blacklisted user
    Given you blacklisted the user "Troll" before
    And there is a post "Hello World" by user "Legit"
    And the blacklisted user wrote a comment on that post:
    """
    I hate you
    """
    When you read through the comments of that post
    Then you will see a hint instead of a comment:
    """
    Comments of this blacklisted user are not visible.
    """
