import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import StatisticCard from '../components/StatisticCard';
import spinner from '../assets/spinner.svg';
import { User, Envelope, CalendarBlank, ArrowLeft } from 'phosphor-react';

const MaintainerDetails = () => {
    const { maintainerId } = useParams();
    const [loading, setLoading] = useState(true);
    const { showError } = useAuth();
    const { t, i18n } = useTranslation();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';
    const navigate = useNavigate();
    const [maintainerStat, setMaintainerStat] = useState(null);
    const [maintainer, setMaintainer] = useState(null);

    useEffect(() => {
        const fetchMaintainerStats = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    `/statistics/admin/${maintainerId}`
                );
                setMaintainerStat(response.data);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.message ||
                              'Hiba történt a karbantartó statisztikájának lekérdezése közben.'
                      )
                    : showError(
                          language,
                          error.response?.data?.message ||
                              'An error occurred while fetching maintainer statistics.'
                      );
                navigate('/statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchMaintainerStats();
    }, []);

    useEffect(() => {
        const fetchMaintainer = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    `/admin/users/${maintainerId}`
                );
                setMaintainer(response.data.user);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.messageHu ||
                              'Hiba történt a karbantartó adatainak lekérdezése közben.'
                      )
                    : showError(
                          language,
                          error.response?.data?.messageEn ||
                              'An error occurred while fetching maintainer details.'
                      );
                navigate('/statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchMaintainer();
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
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {maintainer && (
                <div className="bg-[#27374D] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden transition-all hover:border-blue-500/30">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#526D82] hover:text-white transition-colors mb-6 font-medium"
                    >
                        <ArrowLeft size={20} weight="bold" />
                        {t('reportDetails.backButton')}
                    </button>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                            <User size={48} weight="duotone" />
                        </div>

                        <div className="flex-grow text-center md:text-left space-y-3">
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">
                                    {maintainer.firstName} {maintainer.lastName}
                                </h1>
                                <p className="text-blue-400 font-medium text-sm flex items-center justify-center md:justify-start gap-2">
                                    {maintainer.username}
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                                    <span className="text-gray-400 uppercase text-[10px] tracking-widest">
                                        {maintainer.role}
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <Envelope
                                        size={18}
                                        className="text-blue-400/70"
                                    />
                                    {maintainer.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300 text-sm">
                                    <CalendarBlank
                                        size={18}
                                        className="text-blue-400/70"
                                    />
                                    <span className="text-gray-500 mr-1">
                                        {t('maintainerDetails.joined')}
                                    </span>
                                    {new Date(
                                        maintainer.createdAt
                                    ).toLocaleDateString('hu-HU')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <div className="flex items-center gap-3 ml-2"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {maintainerStat && maintainerStat.length > 0 ? (
                        maintainerStat.map((stat) => (
                            <StatisticCard
                                key={stat.categoryName}
                                stat={stat}
                                type="maintainer"
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center bg-[#27374D]/30 rounded-3xl border-2 border-dashed border-white/5">
                            <p className="text-gray-500 font-medium italic">
                                {t('maintainerDetails.noData')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MaintainerDetails;
