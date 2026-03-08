import React, { useEffect, useState } from 'react';

//context
import { useAuth } from '../context/AuthContext';
//components
import ReportCard from '../components/ReportCard';

import { PlusCircle, Funnel, Eraser } from 'phosphor-react';
import { Pagination, Stack } from '@mui/material';

import axiosInstance from '../utils/axios';

import spinner from '../assets/spinner.svg';

import { useTranslation } from 'react-i18next';

const UserDashboard = () => {
    const { showError } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [filterParams, setFilterParams] = useState({
        status: '',
        priority: '',
    });

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(12);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/reports/user`, {
                    params: {
                        status: filterParams.status || undefined,
                        priority: filterParams.priority || undefined,
                        page: page,
                        limit: limit,
                    },
                });
                setReports(response.data.reports);
                setTotalPages(response.data.totalPages);
                setLimit(response.data.limit);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.messageHu ||
                              'Hiba a lekérdezés közben.'
                      )
                    : showError(
                          language,
                          error.response?.data?.messageEn ||
                              'Error fetching reports.'
                      );
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [filterParams, page, limit]);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    const handleFilterClick = () => {
        setPage(1);
        setFilterParams({
            status,
            priority,
        });
    };

    const resetFilterClick = () => {
        setStatus('');
        setPriority('');
        setPage(1);
        setFilterParams({
            status: '',
            priority: '',
        });
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <div className="bg-[#27374D] border-b border-gray-100 p-6 mb-2 mt-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div></div>

                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            className="bg-gray-50 border border-gray-200 text-[#27374D] text-sm rounded-lg focus:ring-[#526D82] focus:border-[#526D82] block p-2.5 outline-none"
                            onChange={(e) => setStatus(e.target.value)}
                            value={status}
                        >
                            <option value="">{t('userDashboard.all')}</option>
                            <option value="open">
                                {t('userDashboard.open')}
                            </option>
                            <option value="in progress">
                                {t('userDashboard.inProgress')}
                            </option>
                            <option value="done">
                                {t('userDashboard.done')}
                            </option>
                        </select>

                        <select
                            className="bg-gray-50 border border-gray-200 text-[#27374D] text-sm rounded-lg focus:ring-[#526D82] focus:border-[#526D82] block p-2.5 outline-none"
                            onChange={(e) => setPriority(e.target.value)}
                            value={priority}
                        >
                            <option value="">{t('userDashboard.all')}</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>

                        <button className="flex items-center justify-center bg-[#27374D] hover:bg-[#526D82] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95">
                            <PlusCircle
                                size={20}
                                weight="bold"
                                className="mr-2"
                            />
                            <span>{t('userDashboard.newReport')}</span>
                        </button>
                        <button
                            onClick={handleFilterClick}
                            className="flex items-center justify-center bg-[#27374D] hover:bg-[#526D82] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
                        >
                            <Funnel size={20} weight="bold" className="mr-2" />
                            <span>{t('userDashboard.filter')}</span>
                        </button>
                        <button
                            onClick={resetFilterClick}
                            className="flex items-center justify-center bg-[#27374D] hover:bg-[#526D82] text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
                        >
                            <Eraser size={20} weight="bold" className="mr-2" />
                        </button>
                    </div>
                </div>
            </div>
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <img
                        src={spinner}
                        alt="Loading..."
                        className="w-12 h-12 animate-spin"
                    />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {reports.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                {t('userDashboard.noReports')}
                            </p>
                        ) : (
                            reports.map((report) => (
                                <ReportCard key={report.id} report={report} />
                            ))
                        )}
                    </div>

                    {reports.length > 0 && (
                        <div className="flex justify-center pb-10">
                            <Stack spacing={2}>
                                <Pagination
                                    count={totalPages}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: '#27374D',
                                        },
                                        '& .Mui-selected': {
                                            backgroundColor:
                                                '#27374D !important',
                                            color: '#fff',
                                        },
                                    }}
                                />
                            </Stack>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default UserDashboard;
