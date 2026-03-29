import React, { useState } from 'react';
import {
    UserPlus,
    Envelope,
    User,
    IdentificationCard,
    ShieldCheck,
} from 'phosphor-react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
    const { showError, showSuccess } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        role: 'user',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                '/auth/register',
                formData
            );
            setFormData({
                email: '',
                username: '',
                firstName: '',
                lastName: '',
                role: 'user',
            });
            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu || 'Sikeres regisztráció!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn || 'Registration successful!'
                  );
        } catch (error) {
            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.messageHu ||
                          'Regisztráció sikertelen!'
                  )
                : showError(
                      language,
                      error.response?.data?.messageEn || 'Registration failed!'
                  );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                <div className="bg-[#27374D] p-2 rounded-lg text-white">
                    <UserPlus size={28} weight="fill" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#27374D]">
                        {t('register.title')}
                    </h2>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#27374D] mb-2">
                        <User size={18} /> {t('register.username')}
                    </label>
                    <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#27374D] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all"
                        placeholder={t('register.username')}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#27374D] mb-2">
                        <Envelope size={18} /> {t('register.email')}
                    </label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#27374D] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all"
                        placeholder={t('register.emailPlaceholder')}
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#27374D] mb-2">
                        <IdentificationCard size={18} />{' '}
                        {t('register.lastName')}
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#27374D] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all"
                        placeholder={t('register.lastName')}
                    />
                </div>

                <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#27374D] mb-2">
                        <IdentificationCard size={18} />{' '}
                        {t('register.firstName')}
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#27374D] border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all"
                        placeholder={t('register.firstName')}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#27374D] mb-2">
                        <ShieldCheck size={18} />{' '}
                        {t('register.roleLabel') || 'Jogosultság'}
                    </label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-3 bg-[#27374D] text-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#526D82] outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="user">
                            {t('register.user') || 'User'}
                        </option>
                        <option value="maintainer">
                            {t('register.maintainer') || 'Maintainer'}
                        </option>
                        <option value="admin">
                            {t('register.admin') || 'Admin'}
                        </option>
                    </select>
                </div>

                <div className="md:col-span-2 mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#27374D] hover:bg-[#1e2b3c] text-white font-bold py-4 rounded-lg transition-all shadow-lg active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <UserPlus size={22} />
                                {t('register.submitButton')}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Register;
