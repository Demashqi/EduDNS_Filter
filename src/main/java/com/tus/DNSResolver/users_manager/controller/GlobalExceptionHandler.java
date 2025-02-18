
package com.tus.DNSResolver.users_manager.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.tus.DNSResolver.users_manager.exceptions.UsernameAlreadyExistsException;

import org.springframework.web.bind.annotation.ControllerAdvice;

//This is handy to throw custom errors back to the front end.
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UsernameAlreadyExistsException.class)
    public ResponseEntity<String> handleUsernameAlreadyExistsException(UsernameAlreadyExistsException ex) {
        // Return custom error response
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}