package com.gemini.finance.auth;

import com.gemini.finance.user.AppUser;

public record UserProfile(Long id, String name, String email) {
    public static UserProfile from(AppUser user) {
        return new UserProfile(user.getId(), user.getName(), user.getEmail());
    }
}
