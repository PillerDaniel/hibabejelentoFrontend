import React, { useState, useEffect, use } from 'react';
import { useAuth } from '../context/AuthContext';
import spinner from '../assets/spinner.svg';
import axiosInstance from '../utils/axios';
import { useTranslation } from 'react-i18next';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { showError, showSuccess } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.message ||
                          'Hiba a kategóriák lekérése közben.'
                  )
                : showError(
                      language,
                      error.response?.data?.message ||
                          'Error fetching categories.'
                  );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            setSubmitting(true);
            const response = await axiosInstance.post('/categories', {
                name: newCategoryName,
            });

            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu ||
                          'Kategória sikeresen létrehozva!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn ||
                          'Category created successfully!'
                  );

            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                (language === 'hu'
                    ? 'Hiba a létrehozáskor.'
                    : 'Error creating.');
            showError(language, msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-[#2D3E50] p-8 rounded-xl shadow-2xl mb-8 border border-white/5">
                <h2 className="text-xl font-bold mb-6 text-center text-white tracking-wide">
                    {t('category.title')}
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <div className="relative w-full sm:w-72">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder={t('category.placeholder')}
                            className="w-full bg-[#1e293b]/50 border border-white/10 p-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span>{t('category.createButton')}</span>
                        )}
                    </button>
                </form>
            </div>

            <div className="bg-[#2D3E50] rounded-xl shadow-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#526D82]/50 text-gray-300 text-xs uppercase tracking-widest">
                            <th className="px-6 py-4 font-bold">ID</th>
                            <th className="px-6 py-4 font-bold">
                                {t('category.name')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-white divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan="2" className="text-center py-10">
                                    <img
                                        src={spinner}
                                        alt="loading"
                                        className="w-10 h-10 mx-auto animate-spin"
                                    />
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="2"
                                    className="px-6 py-10 text-center text-gray-500 italic"
                                >
                                    {t('category.noCategories')}
                                </td>
                            </tr>
                        ) : (
                            categories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                                        {cat.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-200 group-hover:text-white transition-colors">
                                            {cat.name}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Category;
