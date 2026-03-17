import React, { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { X } from 'phosphor-react';

const EditReportModal = ({ report, onClose, onUpdateSuccess }) => {
    console.log(report);
    const { showError, showSuccess } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: report.title,
        description: report.description,
        priority: report.priority,
        categoryId: report.category.id,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const result = await axiosInstance.get('/categories');
                console.log(result.data);
                setCategories(result.data);
            } catch (err) {
                language === 'hu'
                    ? showError(
                          language,
                          err.response?.data?.messageHu ||
                              'Hiba történt a kategóriák lekérdezése közben.'
                      )
                    : showError(
                          language,
                          err.response?.data?.messageEn ||
                              'Error occurred while fetching categories.'
                      );
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.put(
                `/reports/${report.id}`,
                formData
            );

            language === 'hu'
                ? showSuccess(
                      language,
                      response.data.messageHu || 'Sikeres frissítés!'
                  )
                : showSuccess(
                      language,
                      response.data.messageEn || 'Successful update!'
                  );

            if (onUpdateSuccess) {
                onClose();
                onUpdateSuccess(response.data.report);
            }
        } catch (error) {
            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.messageHu ||
                          'Hiba történt a frissítés közben.'
                  )
                : showError(
                      language,
                      error.response?.data?.messageEn ||
                          'Error occurred while updating.'
                  );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'priority' ? parseInt(value) : value,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#27374D] w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-[#526D82]/20">
                    <h2 className="text-xl font-bold text-white">
                        {t('editReportModal.cardTitle')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <X size={24} weight="bold" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            {t('editReportModal.title')}
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#526D82]/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            {t('editReportModal.category')}
                        </label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#526D82]/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                        >
                            {categories.map((cat) => (
                                <option
                                    key={cat.id}
                                    value={cat.id}
                                    className="bg-[#27374D]"
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            {t('editReportModal.priority')}
                        </label>
                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full bg-[#526D82]/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        >
                            {[1, 2, 3, 4, 5].map((num) => (
                                <option
                                    key={num}
                                    value={num}
                                    className="bg-[#27374D]"
                                >
                                    {num}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-1">
                            {t('editReportModal.description')}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            className="w-full bg-[#526D82]/30 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            {t('editReportModal.cancelButton')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>
                                        {t('editReportModal.saveButton')}
                                    </span>
                                </>
                            ) : (
                                t('editReportModal.saveButton')
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditReportModal;
