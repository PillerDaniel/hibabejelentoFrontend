import React, { use, useEffect, useState } from 'react';
import { User, Envelope, Lock, Key, CheckCircle } from 'phosphor-react';

import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { useTranslation } from 'react-i18next';
import spinner from '../assets/spinner.svg';

const Profile = () => {
    const { showError, showSuccess } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [oldpassword, setOldPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/users/profile', {});
                setUserData(response.data.user);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.messageHu ||
                              'Hiba a felhasználói adatok lekérésekor.'
                      )
                    : showError(
                          language,
                          error.response?.data?.messageEn ||
                              'Error fetching user data.'
                      );
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!oldpassword || !newpassword) {
            language === 'hu'
                ? showError(language, 'Kérem töltse ki mindkét mezőt.')
                : showError(language, 'Please fill out both fields.');
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axiosInstance.patch('/auth/changepassword', {
                oldpassword,
                newpassword,
            });
            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu || 'Sikeres bejelentkezés!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn || 'Login successful!'
                  );

            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            if (error.response.data.errors) {
                const errors = error.response.data.errors;
                const msgHu = errors
                    .map((e) => `- ${e.msg.messageHu}`)
                    .join('<br />');

                const msgEn = errors
                    .map((e) => `- ${e.msg.messageEn}`)
                    .join('<br />');

                language === 'hu'
                    ? showError(language, msgHu)
                    : showError(language, msgEn);
                return;
            }

            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.messageHu ||
                          'Hiba a jelszó módosítása során.'
                  )
                : showError(
                      language,
                      error.response?.data?.messageEn ||
                          'Error changing password.'
                  );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <img
                    src={spinner}
                    alt="Loading..."
                    className="w-12 h-12 animate-spin"
                />
            </div>
        );
    }
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div className="bg-[#27374D] rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <User size={40} weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white italic tracking-tight">
                            {userData.lastName} {userData.firstName}
                        </h1>
                        <p className="text-blue-400 font-medium text-sm">
                            {userData.role}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">
                            {t('profile.email')}
                        </p>
                        <div className="flex items-center gap-3 bg-[#526D82]/20 p-4 rounded-xl border border-white/5 text-gray-200">
                            <Envelope size={20} className="text-blue-400" />
                            <span>{userData.email}</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold ml-1">
                            {t('profile.username')}
                        </p>
                        <div className="flex items-center gap-3 bg-[#526D82]/20 p-4 rounded-xl border border-white/5 text-gray-200">
                            <User size={20} className="text-blue-400" />
                            <span>{userData.username}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#27374D] rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <Lock size={24} weight="fill" className="text-blue-400" />
                    <h2 className="text-xl font-bold text-white">
                        {t('profile.changePassword')}
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handlePasswordChange}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1">
                                {t('profile.currentPassword')}
                            </label>
                            <div className="relative">
                                <Key
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#1a2635] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={oldpassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 ml-1">
                                {t('profile.newPassword')}
                            </label>
                            <div className="relative">
                                <Lock
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-[#1a2635] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    value={newpassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`relative flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 min-w-[140px] ${
                                isSubmitting
                                    ? 'opacity-70 cursor-not-allowed'
                                    : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle size={20} weight="bold" />
                                    <span>{t('profile.saveButton')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
