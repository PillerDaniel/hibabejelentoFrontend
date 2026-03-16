import React, { useState } from 'react';
import {
    CalendarBlank,
    WarningCircle,
    Tag,
    IdentificationCard,
} from 'phosphor-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router';

const MaintainerCard = ({ report }) => {
    const [loading, setLoading] = useState(false);
    const [buttonVisibility, setButtonVisibility] = useState(true);
    const [managedByUsername, setManagedByUsername] = useState(
        report.managedBy?.username
    );
    const [managedByRole, setManagedByRole] = useState(report.managedBy?.role);
    const [status, setStatus] = useState(report.status);

    const { t, i18n } = useTranslation();
    const { user, showError, showSuccess } = useAuth();
    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const navigate = useNavigate();

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
                return t('maintainerCard.maintainer');
            case 'admin':
                return t('maintainerCard.admin');
        }
    };

    const assignToMaintainer = async (reportId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.patch(
                `/reports/${reportId}/assign`
            );
            if (response) {
                language === 'hu'
                    ? showSuccess(
                          language,
                          response.data?.messageHu || 'Sikeresen hozzárendelve!'
                      )
                    : showSuccess(
                          language,
                          response.data?.messageEn ||
                              'Report assigned successfully!'
                      );
                setButtonVisibility(false);
                setManagedByUsername(user.username);
                setManagedByRole(user.role);
                setStatus('in progress');
            }
        } catch (error) {
            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.messageHu ||
                          'Hozzárendelés sikertelen!'
                  )
                : showError(
                      language,
                      error.response?.data?.messageEn ||
                          'Report assignment failed!'
                  );
        } finally {
            setLoading(false);
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
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusStyles(status)}`}
                >
                    {status === 'open'
                        ? t('maintainerCard.open')
                        : status === 'in progress'
                          ? t('maintainerCard.inProgress')
                          : t('maintainerCard.done')}
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
                        {managedByUsername != null
                            ? `${managedByUsername} (${decideRole(managedByRole)})`
                            : t('maintainerCard.unassigned')}
                    </span>
                </div>
                <div
                    className={`flex items-center gap-1 text-xs font-medium ${getPriorityStyles(report.priority)}`}
                >
                    <WarningCircle
                        size={16}
                        weight={report.priority > 3 ? 'fill' : 'regular'}
                    />
                    {t('maintainerCard.priority')} {report.priority}
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-end items-center mt-4 gap-4">
                <button
                    onClick={() =>
                        navigate(`/maintainer-dashboard/${report.id}`)
                    }
                    type="button"
                    className="text-white bg-[#526d82] hover:bg-blue-300 focus:ring-4 focus:ring-blue-200 cursor-pointer rounded-full text-sm px-5 py-2.5 font-medium transition-all active:scale-95 focus:outline-none shadow-sm"
                >
                    {t('maintainerCard.details')}
                </button>
                {report.managedBy === null && buttonVisibility && (
                    <button
                        onClick={() => assignToMaintainer(report.id)}
                        disabled={loading}
                        type="button"
                        className="min-w-[140px] flex justify-center items-center gap-2 text-white bg-[#526d82] hover:bg-[#3b4e5d] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer rounded-full text-sm px-5 py-2.5 font-medium transition-all active:scale-95 shadow-sm"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            t('maintainerCard.assignButton')
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default MaintainerCard;
