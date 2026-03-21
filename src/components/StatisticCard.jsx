import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tag, ChartBar, CheckCircle, Clock } from 'phosphor-react';

const StatisticCard = ({ stat, type }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className="bg-[#27374D] rounded-2xl shadow-sm border border-white p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <span className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider bg-[#526D82] px-3 py-1 rounded-lg">
                    <Tag size={18} weight="bold" />
                    {stat.categoryName}
                </span>
                <ChartBar size={24} className="text-blue-300" />
            </div>

            <div className="flex-grow space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#526D82]/30 p-3 rounded-xl border border-white/10">
                        <p className="text-[10px] text-gray-300 uppercase mb-1">
                            {t('statisticCard.total')}
                        </p>
                        <p className="text-2xl font-black text-white">
                            {stat.totalReports}
                        </p>
                    </div>
                    {type === 'maintainer' && (
                        <div className="bg-[#526D82]/30 p-3 rounded-xl border border-white/10">
                            <p className="text-[10px] text-gray-300 uppercase mb-1">
                                {t('statisticCard.inProgress')}
                            </p>
                            <p className="text-2xl font-black text-yellow-400">
                                {stat.totalReports - stat.closedReports}
                            </p>
                        </div>
                    )}
                    <div className="bg-[#526D82]/30 p-3 rounded-xl border border-white/10">
                        <p className="text-[10px] text-gray-300 uppercase mb-1">
                            {t('statisticCard.closed')}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-black text-green-400">
                                {stat.closedReports}
                            </p>
                            <CheckCircle
                                size={20}
                                weight="fill"
                                className="text-green-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div
                        className="bg-green-400 h-1.5 rounded-full transition-all duration-500"
                        style={{
                            width: `${(stat.closedReports / stat.totalReports) * 100}%`,
                        }}
                    ></div>
                </div>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-3 text-white">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                        <Clock size={18} />
                        <span>{t('statisticCard.avgTime')}</span>
                    </div>
                    <span className="font-mono font-bold text-blue-300">
                        {stat.averageTime
                            ? `${stat.averageTime.hours ? stat.averageTime.hours + 'h ' : ''}${stat.averageTime.minutes ? stat.averageTime.minutes + 'm ' : ''}${stat.averageTime.seconds ? stat.averageTime.seconds + 's' : ''}`
                            : '--'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default StatisticCard;
