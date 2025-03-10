@ignore
Feature: Authentication API

Scenario: Login and get JWT token
  Given url 'http://localhost:9091/api/auth/login'
  And request { username: 'admin', password: 'admin' }
  When method post
  Then status 200
  And def jwtToken = response.jwt
