Feature: Save current newsfeed filters to usersettings
  As a user of human connection
  You would like to have my latest newsfeed filter settings saved
  In order to see the same selection of content next time I log in

  Background:
    Given the Human Connection API is up and running
    And there is a user in Human Connection with these credentials:
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
