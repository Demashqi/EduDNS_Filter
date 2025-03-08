Feature: Blocklist API

Background:
  * def login = callonce read('classpath:features/authentication.feature')
  * url 'http://localhost:9091'
  * header Authorization = 'Bearer ' + login.jwtToken
  * header Content-Type = 'application/json'

Scenario: Add blocked domain
  Given path '/api/teacher/blocklist'
  And request { domain: 'example.com' }
  When method post
  Then status 200

Scenario: Get all blocked domains
  Given path '/api/teacher/blocklist'
  When method get
  Then status 200

Scenario: Get blocked domain by ID
  Given path '/api/teacher/blocklist/1'
  When method get
  Then status 200

Scenario: Delete blocked domain by name
  Given path '/api/teacher/blocklist/name/example.com'
  When method delete
  Then status 204
  And match response == ''