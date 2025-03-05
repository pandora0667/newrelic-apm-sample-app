package com.library.service;

import com.library.domain.user.User;
import com.library.dto.user.UserDto;
import com.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public List<UserDto.Response> getAllUsers() {
        return userRepository.findAll().stream()
            .map(UserDto.Response::from)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public UserDto.Response register(UserDto.RegisterRequest request) {
        // 중복 검사
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 이름입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        
        // 사용자 생성
        User user = User.createUser(
            request.getUsername(),
            request.getEmail(),
            encodedPassword,
            request.getFullName()
        );
        
        // 저장
        User savedUser = userRepository.save(user);
        
        return UserDto.Response.from(savedUser);
    }
    
    public UserDto.Response getUserInfo(String userId) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        return UserDto.Response.from(user);
    }
    
    @Transactional
    public UserDto.Response updateUser(String userId, UserDto.UpdateRequest request) {
        User user = userRepository.findByUserId(userId)
            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        
        // 이메일 중복 검사
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
            }
            user.setEmail(request.getEmail());
        }
        
        // 이름 업데이트
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        
        return UserDto.Response.from(user);
    }
} 