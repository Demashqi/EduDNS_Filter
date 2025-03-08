Feature: Admin Users API

Background:
  * def login = callonce read('classpath:features/authentication.feature')
  * url 'http://localhost:9091'
  * header Authorization = 'Bearer ' + login.jwtToken
  * header Content-Type = 'application/json'

Scenario: Register new user
  Given path '/api/admin/register'
  And request { username: 'testuser', password: 'admin', roles: ['ADMIN'] }
  When method post
  Then status 200

Scenario: Get all users
  Given path '/api/admin/users'
  When method get
  Then status 200

Scenario: Update user by ID
  Given path '/api/admin/users/2'
  And request { id: 3, username: 'teacher3', password: '123', roles: ['TEACHER'] }
  When method put
  Then status 200

Scenario: Delete user by ID
  Given path '/api/admin/users/2'
  When method delete
  Then status 204
  And match response == ''