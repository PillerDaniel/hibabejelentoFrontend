import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Pagination, Stack } from '@mui/material';
import { User, Eye } from 'phosphor-react';

import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';

import spinner from '../assets/spinner.svg';

const AdminStatistic = () => {
    const [loading, setLoading] = useState(true);
    const [maintainers, setMaintainers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const limit = 12;

    const totalPages = Math.ceil(total / limit);

    const { t, i18n } = useTranslation();
    const language = i18n.language || window.localStorage.i18nextLng || 'en';
    const navigate = useNavigate();
    const { showError } = useAuth();

    useEffect(() => {
        const fetchMaintainers = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/admin/maintainers', {
                    params: {
                        page,
                        limit,
                    },
                });
                setMaintainers(response.data.maintainers);
                console.log(response.data.maintainers);
                setTotal(response.data.total);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.message ||
                              'Hiba a karbantartók lekérése közben.'
                      )
                    : showError(
                          language,
                          error.response?.data?.message ||
                              'Error fetching maintainers.'
                      );
            } finally {
                setLoading(false);
            }
        };

        fetchMaintainers();
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
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
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    {t('adminStatistic.title') || 'Karbantartók listája'}
                </h2>
            </div>

            <div className="bg-[#27374D] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#526D82]/50 text-gray-300 text-xs uppercase tracking-widest">
                            <th className="px-6 py-4 font-bold">
                                {t('adminStatistic.username')}
                            </th>
                            <th className="px-6 py-4 font-bold">
                                {t('adminStatistic.email')}
                            </th>
                            <th className="px-6 py-4 font-bold">
                                {t('adminStatistic.createdAt')}
                            </th>
                            <th className="px-6 py-4 font-bold text-center">
                                {t('adminStatistic.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-white divide-y divide-white/5">
                        {maintainers.length > 0 ? (
                            maintainers.map((m) => (
                                <tr
                                    key={m.id}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <User size={18} weight="bold" />
                                        </div>
                                        <span className="font-medium">
                                            {m.username}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {m.email}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">
                                        {new Date(
                                            m.createdAt
                                        ).toLocaleDateString(
                                            language === 'hu'
                                                ? 'hu-HU'
                                                : 'en-US',
                                            {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            }
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/statistics/${m.id}`
                                                    )
                                                }
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                                            >
                                                <Eye size={16} weight="bold" />
                                                {t('adminStatistic.open')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="px-6 py-10 text-center text-gray-500 italic"
                                >
                                    {t('adminStatistic.noData')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {total > limit && (
                <div className="flex justify-center pt-6">
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: '#fff',
                                    borderColor: 'rgba(255,255,255,0.2)',
                                },
                                '& .Mui-selected': {
                                    backgroundColor: '#3b82f6 !important',
                                    color: '#fff',
                                },
                                '& .MuiPaginationItem-ellipsis': {
                                    color: '#9ca3af',
                                },
                            }}
                        />
                    </Stack>
                </div>
            )}
        </div>
    );
};

export default AdminStatistic;
