Feature: Individual Blacklist
  As a user
  I want to click on a button to blacklist certain user profiles
  In order to stop seeing contributions of this account, because I don't like them

  Background:
    Given this is your user account:
      | email            | password | isVerified |
      | user@example.com |     1234 | true       |
    And these user accounts exist:
      | Id    | Name  | email              | isVerified |
      | 12345 | Troll | troll@example.com  | true       |


  Scenario:
    Given you are authenticated
    When you create your user settings via POST request to "/usersettings" with:
    """
    {
      "blacklist": ["12345"]
    }
    """
    Then you will stop seeing posts of the user with id "12345"
