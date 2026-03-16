import React from 'react';
import {
    CalendarBlank,
    WarningCircle,
    Tag,
    IdentificationCard,
} from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const ReportCard = ({ report }) => {
    const { t, i18n } = useTranslation();

    const getStatusStyles = (status) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'in progress':
                return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'done':
                return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        }
    };

    const navigate = useNavigate();

    const getPriorityStyles = (priority) => {
        if (priority === 1) {
            return 'text-green-500';
        } else if (priority === 2 || priority === 3) {
            return 'text-amber-500';
        } else {
            return 'text-red-500';
        }
    };

    const decideRole = (role) => {
        switch (role) {
            case 'maintainer':
                return t('reportCardUser.maintainer');
            case 'admin':
                return t('reportCardUser.admin');
        }
    };

    return (
        <div className="bg-[#27374D] rounded-2xl shadow-sm border border-white p-5 hover:shadow-md transition-shadow flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-white uppercase tracking-wider">
                    <Tag size={14} weight="bold" />
                    {report.category.name}
                </span>
                <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusStyles(report.status)}`}
                >
                    {report.status === 'open'
                        ? t('userDashboard.open')
                        : report.status === 'in progress'
                          ? t('userDashboard.inProgress')
                          : t('userDashboard.done')}
                </span>
            </div>

            <div className="flex-grow">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                    {report.title}
                </h3>
                <p className="text-sm text-white line-clamp-3 mb-4">
                    {report.description.length > 40
                        ? report.description.substring(0, 40) + '...'
                        : report.description}
                </p>
            </div>

            <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-white">
                <div className="flex items-center gap-1.5 text-xs">
                    <CalendarBlank size={16} />
                    {new Date(report.createdAt).toLocaleString('hu-HU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </div>
                <div className="flex items-center gap-2 text-white">
                    <IdentificationCard size={24} />
                    <span className="text-xs">
                        {report.managedBy != null
                            ? `${report.managedBy.username} (${decideRole(report.managedBy.role)})`
                            : t('reportCardUser.unassigned')}
                    </span>
                </div>
                <div
                    className={`flex items-center gap-1 text-xs font-medium ${getPriorityStyles(report.priority)}`}
                >
                    <WarningCircle
                        size={16}
                        weight={report.priority > 3 ? 'fill' : 'regular'}
                    />
                    {t('reportCardUser.priority')} {report.priority}
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-end items-center mt-4 gap-4">
                <button
                    onClick={() => navigate(`/my-reports/${report.id}`)}
                    type="button"
                    className="text-white bg-[#526d82] hover:bg-blue-300 focus:ring-4 focus:ring-blue-200 cursor-pointer rounded-full text-sm px-5 py-2.5 font-medium transition-all active:scale-95 focus:outline-none shadow-sm"
                >
                    {t('maintainerCard.details')}
                </button>
            </div>
        </div>
    );
};

export default ReportCard;
