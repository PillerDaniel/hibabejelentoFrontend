import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axiosInstance from '../utils/axios';

import { useTranslation } from 'react-i18next';

import { useAuth } from '../context/AuthContext';
const Login = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);

    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const { login, showError, showSuccess } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!form.username || !form.password) {
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/login', form);
            login(response.data.user);
            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu || 'Sikeres bejelentkezés!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn || 'Login successful!'
                  );
            navigate('/');
        } catch (error) {
            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.messageHu ||
                          'Bejelentkezés sikertelen!'
                  )
                : showError(
                      language,
                      error.response?.data?.messageEn || 'Login failed!'
                  );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen  bg-[#9DB2BF]">
            <div className="bg-[#526d82] text-gray-500 w-96 mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10">
                <h2 className="text-2xl font-semibold mb-6 text-center text-white">
                    {t('login.title')}
                </h2>
                <form onSubmit={handleSubmit}>
                    <p className="text-white">{t('login.username')}</p>
                    <input
                        name="username"
                        value={form.username}
                        className="w-full bg-[#27374D] border my-3 border-white outline-none rounded-full py-2.5 px-4 mb-3"
                        type="text"
                        placeholder={t('login.username_placehlder')}
                        onChange={handleChange}
                        required
                    />
                    <p className="text-white">{t('login.password')}</p>
                    <input
                        name="password"
                        value={form.password}
                        className="w-full bg-[#27374D] border mt-1 border-white outline-none rounded-full py-2.5 px-4 mb-6"
                        type="password"
                        placeholder={t('login.password_placeholder')}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full mb-3 bg-[#27374D] py-2.5 rounded-full text-white"
                    >
                        {loading
                            ? t('login.buttontext_loading')
                            : t('login.buttontext')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
