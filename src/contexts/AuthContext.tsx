"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, AuthState, LoginCredentials, AuthResponse } from '@/types';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Load auth state from localStorage on mount
    useEffect(() => {
        const loadAuthState = () => {
            try {
                const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                const userStr = localStorage.getItem(STORAGE_KEYS.USER);

                if (accessToken && refreshToken && userStr) {
                    const user: User = JSON.parse(userStr);
                    setState({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    setState(prev => ({ ...prev, isLoading: false }));
                }
            } catch (error) {
                console.error('Error loading auth state:', error);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        loadAuthState();
    }, []);

    // Save auth state to localStorage whenever it changes
    useEffect(() => {
        if (state.isAuthenticated && state.user && state.accessToken && state.refreshToken) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, state.accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
        }
    }, [state]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            const response = await api.post<AuthResponse>('/authentication/login/', credentials);

            const { data } = response.data;
            const user: User = {
                id: data.id,
                username: data.username,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                is_active: data.is_active,
                is_staff: data.is_staff,
                date_joined: data.date_joined,
            };

            setState({
                user,
                accessToken: data.access,
                refreshToken: data.refresh,
                isAuthenticated: true,
                isLoading: false,
            });

            router.push('/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(
                error.response?.data?.data?.error ||
                error.response?.data?.message ||
                'Login failed. Please check the credentials.'
            );
        }
    }, [router]);

    const logout = useCallback(() => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);

        // Reset state
        setState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
        });

        // Redirect to login
        router.push('/login');
    }, [router]);

    const refreshAccessToken = useCallback(async (): Promise<boolean> => {
        try {
            if (!state.refreshToken) {
                return false;
            }

            const response = await api.post('/authentication/token/refresh/', {
                refresh: state.refreshToken,
            });

            const newAccessToken = response.data.access;

            setState(prev => ({
                ...prev,
                accessToken: newAccessToken,
            }));

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return false;
        }
    }, [state.refreshToken, logout]);

    const value: AuthContextType = {
        ...state,
        login,
        logout,
        refreshAccessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
