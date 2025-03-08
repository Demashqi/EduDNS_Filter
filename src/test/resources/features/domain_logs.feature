Feature: Domain Logs API

Background:
  * def login = callonce read('classpath:features/authentication.feature')
  * url 'http://localhost:9091'
  * header Authorization = 'Bearer ' + login.jwtToken

Scenario: Get all domain logs
  Given path '/api/admin/domain-logs'
  When method get
  Then status 200

Scenario: Delete all domain logs
  Given path '/api/admin/domain-logs'
  When method delete
  Then status 204
  And match response == ''

Scenario: Delete existing domain log
  Given path '/api/admin/domain-logs/1'
  When method delete
  Then status 404
  And match response == ''

Scenario: Delete non-existent domain log
  Given path '/api/admin/domain-logs/999'
  When method delete
  Then status 404
  And match response == ''
