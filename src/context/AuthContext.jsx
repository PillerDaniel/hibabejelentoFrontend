import React, { useEffect, useState, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext();

//modals
import ErrorModal from '../components/modals/ErrorModal';
import SuccesModal from '../components/modals/SuccesModal';

import axiosInstance from '../utils/axios';

export const AuthProvider = ({ children }) => {
    const { i18n } = useTranslation();

    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorLang, setErrorLang] = useState('en');
    const [successLang, setSuccessLang] = useState(null);
    const [success, setSuccess] = useState(null);
    const showError = (lang, msg) => {
        setErrorLang(lang);
        setError(msg);
    };
    const clearError = () => setError(null);
    const showSuccess = (lang, msg) => {
        setSuccessLang(lang);
        setSuccess(msg);
    };
    const clearSuccess = () => setSuccess(null);

    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/auth/me');
                if (response.data.user) {
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (user) => {
        setUser(user);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            const response = await axiosInstance.post('/auth/logout');
            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu || 'Sikeres kijelentkezés!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn || 'Logout successful!'
                  );
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                login,
                logout,
                loading,
                showError,
                showSuccess,
            }}
        >
            {children}
            <ErrorModal lang={errorLang} message={error} onClose={clearError} />
            <SuccesModal
                lang={successLang}
                message={success}
                onClose={clearSuccess}
            />
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
