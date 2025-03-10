package com.tus.EduDNSFilter.users_manager.service;


import com.tus.EduDNSFilter.users_manager.dto.UserDTO;
import com.tus.EduDNSFilter.users_manager.model.Role;
import com.tus.EduDNSFilter.users_manager.model.User;
import com.tus.EduDNSFilter.users_manager.repository.UserRepository;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        // Set a default SecurityContext so we can control the "current user" in tests
        SecurityContextHolder.setContext(securityContext);
    }

    // -----------------------------------------------------------
    // getAllUsers()
    // -----------------------------------------------------------
    @Test
    void testGetAllUsers() {
        // GIVEN
        User user1 = new User();
        user1.setUsername("user1");
        User user2 = new User();
        user2.setUsername("user2");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // WHEN
        List<User> result = userService.getAllUsers();

        // THEN
        assertEquals(2, result.size());
        assertEquals("user1", result.get(0).getUsername());
        assertEquals("user2", result.get(1).getUsername());
        verify(userRepository).findAll();
    }

    // -----------------------------------------------------------
    // deleteUser(Long id)
    // -----------------------------------------------------------
    @Test
    void testDeleteUser_Success() {
        // GIVEN
        Long userIdToDelete = 100L;
        User userToDelete = new User();
        userToDelete.setId(userIdToDelete);
        userToDelete.setUsername("deleteMe");

        // Current user is not the same as userToDelete
        // and is an ADMIN but different ID => can delete
        User currentUser = new User();
        currentUser.setId(99L);
        currentUser.setUsername("adminUser");
        currentUser.setRoles(Set.of(Role.ADMIN));

        when(securityContext.getAuthentication())
            .thenReturn(new TestingAuthenticationToken("adminUser", null));
        when(userRepository.findByUsername("adminUser"))
            .thenReturn(Optional.of(currentUser));
        when(userRepository.findById(userIdToDelete))
            .thenReturn(Optional.of(userToDelete));

        // WHEN
        userService.deleteUser(userIdToDelete);

        // THEN
        // Verify userRepository.delete was called
        verify(userRepository).delete(userToDelete);
    }

    @Test
    void testDeleteUser_AdminDeletesSelf_Forbidden() {
        // GIVEN
        Long userIdToDelete = 99L;
        User currentUser = new User();
        currentUser.setId(userIdToDelete);
        currentUser.setUsername("adminUser");
        currentUser.setRoles(Set.of(Role.ADMIN));

        when(securityContext.getAuthentication())
            .thenReturn(new TestingAuthenticationToken("adminUser", null));
        when(userRepository.findByUsername("adminUser"))
            .thenReturn(Optional.of(currentUser));

        // WHEN & THEN
        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> userService.deleteUser(userIdToDelete)
        );
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
        assertEquals("Admins cannot delete themselves.", ex.getReason());
    }

    @Test
    void testDeleteUser_UserNotFound() {
        // GIVEN
        Long userIdToDelete = 500L;
        User currentUser = new User();
        currentUser.setId(99L);
        currentUser.setUsername("adminUser");
        currentUser.setRoles(Set.of(Role.ADMIN));

        when(securityContext.getAuthentication())
            .thenReturn(new TestingAuthenticationToken("adminUser", null));
        when(userRepository.findByUsername("adminUser"))
            .thenReturn(Optional.of(currentUser));
        // user to delete does not exist
        when(userRepository.findById(userIdToDelete)).thenReturn(Optional.empty());

        // WHEN & THEN
        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> userService.deleteUser(userIdToDelete)
        );
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertEquals("User not found", ex.getReason());
    }

    // -----------------------------------------------------------
    // updateUser(Long id, User updatedUser)
    // -----------------------------------------------------------
    @Test
    void testUpdateUser_Success() {
        // GIVEN
        Long userIdToUpdate = 200L;
        User existingUser = new User();
        existingUser.setId(userIdToUpdate);
        existingUser.setUsername("existingUser");
        existingUser.setRoles(Set.of(Role.ADMIN)); // e.g., existing roles

        User currentUser = new User();
        currentUser.setId(99L);
        currentUser.setUsername("adminUser");
        currentUser.setRoles(Set.of(Role.ADMIN));

        when(securityContext.getAuthentication())
            .thenReturn(new TestingAuthenticationToken("adminUser", null));
        when(userRepository.findByUsername("adminUser"))
            .thenReturn(Optional.of(currentUser));

        when(userRepository.findById(userIdToUpdate))
            .thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class)))
            .thenAnswer(invocation -> invocation.getArgument(0));

        User updatedUser = new User();
        updatedUser.setPassword("newPassword");
        updatedUser.setRoles(Set.of(Role.TEACHER)); // e.g., new roles

        // WHEN
        UserDTO result = userService.updateUser(userIdToUpdate, updatedUser);

        // THEN
        verify(userRepository).save(existingUser);
        // password should be encoded
        // We didn't define what passwordEncoder.encode returns, so it's null by default
        // but let's define it now:
        // (Add in the test if you like) when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPass");
        // then check: assertEquals("encodedNewPass", existingUser.getPassword());

        // roles should now be assigned according to your assignRoles logic
        assertTrue(result.getRoles().contains(Role.TEACHER));
        // (depending on your method, might also contain Role.CUSTOMER_SERVICE_REP)
    }

    @Test
    void testUpdateUser_UserNotFound() {
        // GIVEN
        Long userIdToUpdate = 300L;
        when(userRepository.findById(userIdToUpdate)).thenReturn(Optional.empty());

        // WHEN & THEN
        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> userService.updateUser(userIdToUpdate, new User())
        );
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertEquals("User not found", ex.getReason());
    }

    @Test
    void testUpdateUser_AdminRemovingOwnAdminRole_Forbidden() {
        // GIVEN
        Long userIdToUpdate = 400L;
        User existingUser = new User();
        existingUser.setId(userIdToUpdate);
        existingUser.setUsername("adminUser");
        existingUser.setRoles(Set.of(Role.ADMIN));

        User currentUser = new User();
        currentUser.setId(userIdToUpdate);
        currentUser.setUsername("adminUser");
        currentUser.setRoles(Set.of(Role.ADMIN));

        when(securityContext.getAuthentication())
            .thenReturn(new TestingAuthenticationToken("adminUser", null));
        when(userRepository.findByUsername("adminUser"))
            .thenReturn(Optional.of(currentUser));
        when(userRepository.findById(userIdToUpdate))
            .thenReturn(Optional.of(existingUser));

        // updatedUser doesn't have ADMIN in roles => removing admin role from self
        User updatedUser = new User();
        updatedUser.setRoles(Set.of(Role.TEACHER));

        // WHEN & THEN
        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> userService.updateUser(userIdToUpdate, updatedUser)
        );
        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
        assertEquals("Admins cannot remove their own admin role.", ex.getReason());
    }

    @Test
    void testUpdateUser_CurrentUserNotFound() {
        // GIVEN
        Long userIdToUpdate = 500L;
        User existingUser = new User();
        existingUser.setId(userIdToUpdate);
        existingUser.setUsername("someUser");

        // user to update does exist
        when(userRepository.findById(userIdToUpdate))
            .thenReturn(Optional.of(existingUser));
        // but the current user does not exist
        when(securityContext.getAuthentication())
            .thenReturn(new TestingAuthenticationToken("missingUser", null));
        when(userRepository.findByUsername("missingUser"))
            .thenReturn(Optional.empty());

        // WHEN & THEN
        ResponseStatusException ex = assertThrows(
            ResponseStatusException.class,
            () -> userService.updateUser(userIdToUpdate, new User())
        );
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatus());
        assertEquals("Current user not found", ex.getReason());
    }
}
