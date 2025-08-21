package com.example.loginsystem.controller;

import com.example.loginsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, 
                                  @RequestParam String password) {
        boolean isValid = userService.validateUser(username, password);
        
        if (isValid) {
            return ResponseEntity.ok().body("{\"message\":\"Login successful\"}");
        } else {
            return ResponseEntity.badRequest().body("{\"error\":\"Invalid credentials\"}");
        }
    }
}
