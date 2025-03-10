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

Scenario: Domain is already blocked
  Given path '/api/teacher/blocklist'
  And request { domain: 'example.com' }
  When method post
  Then status 409

Scenario: Get all blocked domains
  Given path '/api/teacher/blocklist'
  When method get
  Then status 200

Scenario: Get blocked domain by ID
  Given path '/api/teacher/blocklist/1'
  When method get
  Then status 200

Scenario: update blocked domain by ID
  Given path '/api/teacher/blocklist/1'
  And request { domain: 'example.ai' }
  When method put
  Then status 200

Scenario: not found update blocked domain by ID
  Given path '/api/teacher/blocklist/3'
  And request { domain: 'random.com' }
  When method put
  Then status 404

Scenario: not found get blocked domain by ID
  Given path '/api/teacher/blocklist/3'
  And request { domain: 'random.com' }
  When method get
  Then status 404

Scenario: not found delte blocked domain by ID
  Given path '/api/teacher/blocklist/3'
  And request { domain: 'random.com' }
  When method delete
  Then status 404

Scenario: Delete blocked domain by name
  Given path '/api/teacher/blocklist/name/example.ai'
  When method delete
  Then status 204
  And match response == ''

Scenario: Add another blocked domain
  Given path '/api/teacher/blocklist'
  And request { domain: 'tus.com' }
  When method post
  Then status 200

Scenario: Delete blocked domain by ID
  Given path '/api/teacher/blocklist/2'
  When method delete
  Then status 204
  And match response == ''