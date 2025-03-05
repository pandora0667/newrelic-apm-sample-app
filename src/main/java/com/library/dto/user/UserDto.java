package com.library.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class UserDto {
    
    @Data
    public static class RegisterRequest {
        @NotBlank(message = "사용자 이름은 필수입니다")
        private String username;
        
        @NotBlank(message = "이메일은 필수입니다")
        @Email(message = "올바른 이메일 형식이 아닙니다")
        private String email;
        
        @NotBlank(message = "비밀번호는 필수입니다")
        private String password;
        
        @NotBlank(message = "이름은 필수입니다")
        private String fullName;
    }
    
    @Data
    public static class Response {
        private String userId;
        private String username;
        private String email;
        private String fullName;
        private String createdAt;
        
        public static Response from(com.library.domain.user.User user) {
            Response response = new Response();
            response.setUserId(user.getUserId());
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());
            response.setFullName(user.getFullName());
            response.setCreatedAt(user.getCreatedAt().toString());
            return response;
        }
    }
    
    @Data
    public static class UpdateRequest {
        @Email(message = "올바른 이메일 형식이 아닙니다")
        private String email;
        private String fullName;
    }
} 