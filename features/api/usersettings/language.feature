Feature: Save preferred language settings
  As a user of human connection
  You would like to have my preferred language saved
  So when I log in the next time, the UI switches to my language automatically

  Background:
    Given the Human Connection API is up and running
    And this is your user account:
      | email            | password | isVerified |
      | user@example.com |     1234 | true       |

  Scenario: Save user's language
    Given you are authenticated
    When you create your user settings via POST request to "/usersettings" with:
    """
    {
      "uiLanguage": "de"
    }
    """
    Then your language "de" is stored in your user settings
