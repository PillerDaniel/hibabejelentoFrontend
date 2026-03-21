import React, { useState, useEffect, use } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

import axiosInstance from '../utils/axios';

import StatisticCard from '../components/StatisticCard';

import spinner from '../assets/spinner.svg';

const Landing = () => {
    const { user, showError } = useAuth();
    const [loading, setLoading] = useState(true);
    const [overallStats, setOverallStats] = useState(null);
    const [maintainerStats, setMaintainerStats] = useState(null);
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    useEffect(() => {
        const fetchOverallStats = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/statistics');
                console.log('Overall stats response:', response.data);
                setOverallStats(response.data);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.message ||
                              'Hiba a lekérdezés közben.'
                      )
                    : showError(
                          language,
                          error.response?.data?.message ||
                              'Error fetching statistics.'
                      );
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchOverallStats();
        }
    }, []);

    useEffect(() => {
        const fetchMaintainerStats = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    '/statistics/maintainer'
                );
                console.log('Maintainer stats response:', response.data);
                setMaintainerStats(response.data);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.message ||
                              'Hiba a lekérdezés közben.'
                      )
                    : showError(
                          language,
                          error.response?.data?.message ||
                              'Error fetching statistics.'
                      );
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMaintainerStats();
        }
    }, []);

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
        <div className="p-6 space-y-12">
            {' '}
            {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="col-span-full mb-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            {t('landing.overallStats')}
                        </h2>
                    </div>

                    {overallStats && overallStats.length > 0 ? (
                        overallStats.map((stat) => (
                            <StatisticCard
                                key={`overall-${stat.categoryName}`}
                                stat={stat}
                                type="overall"
                            />
                        ))
                    ) : (
                        <div className="text-gray-500 italic ml-5">
                            {t('landing.noStat')}
                        </div>
                    )}

                    <div className="col-span-full mb-2">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            {t('landing.maintainerStats')}
                        </h2>
                    </div>

                    {maintainerStats && maintainerStats.length > 0 ? (
                        maintainerStats.map((stat) => (
                            <StatisticCard
                                key={`maintainer-${stat.categoryName}`}
                                stat={stat}
                                type="maintainer"
                            />
                        ))
                    ) : (
                        <div className="text-gray-500 italic ml-5 col-span-full">
                            {t('landing.noStat')}
                        </div>
                    )}
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default Landing;
