import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CalendarBlank,
    Tag,
    WarningCircle,
    ChatCenteredText,
    CheckCircle,
    XCircle,
} from 'phosphor-react';
import axiosInstance from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

import spinner from '../assets/spinner.svg';

const ReportDetails = () => {
    const { user } = useAuth();

    const { reportId } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { showError, showSuccess } = useAuth();

    const language = i18n.language.startsWith('hu') ? 'hu' : 'en';

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    `/reports/${reportId}`
                );
                console.log(response.data.report);
                setReport(response.data.report);
            } catch (error) {
                language === 'hu'
                    ? showError(
                          language,
                          error.response?.data?.messageHu ||
                              'Hiba történt a hibajegy részleteinek lekérésekor.'
                      )
                    : showError(
                          language,
                          error.response?.data?.messageEn ||
                              'An error occurred while fetching report details.'
                      );
                navigate('/maintainer-dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [reportId]);

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
            setReport(response.data?.report);
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
            }
        } catch (error) {
            console.log(error);
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

    const handleStatusChange = async (status) => {
        try {
            setLoading(true);
            const response = await axiosInstance.patch(`/reports/${reportId}`, {
                status,
            });
            setReport(response.data?.report);
            if (response) {
                language === 'hu'
                    ? showSuccess(
                          language,
                          response.data?.messageHu || 'Sikeresen frissítve!'
                      )
                    : showSuccess(
                          language,
                          response.data?.messageEn ||
                              'Report status updated successfully!'
                      );
            }
        } catch (error) {
            language === 'hu'
                ? showError(
                      language,
                      error.response?.data?.messageHu ||
                          'Hiba a státusz frissítésekor!'
                  )
                : showError(
                      language,
                      error.response?.data?.messageEn ||
                          'Report status update failed!'
                  );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#526D82] hover:text-[#27374D] transition-colors mb-6 font-medium"
            >
                <ArrowLeft size={20} weight="bold" />
                {t('reportDetails.backButton')}
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div
                    className={`h-3 ${
                        !report
                            ? 'bg-[#526d82]'
                            : report.priority > 3
                              ? 'bg-red-500'
                              : report.priority > 1 && report.priority <= 3
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                    }`}
                />

                <div className="p-6 md:p-10 bg-[#27374D]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <img
                                src={spinner}
                                alt="Loading..."
                                className="w-12 h-12 animate-spin"
                            />
                        </div>
                    ) : (
                        report && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${getStatusStyles(report.status)}`}
                                            >
                                                {report.status === 'open'
                                                    ? t('reportDetails.open')
                                                    : report.status ===
                                                        'in progress'
                                                      ? t(
                                                            'reportDetails.inProgress'
                                                        )
                                                      : t('reportDetails.done')}
                                            </span>
                                            <span className="text-white text-sm flex items-center gap-1">
                                                <Tag size={16} />{' '}
                                                {report.category?.name}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl font-extrabold text-white leading-tight">
                                            {report.title}
                                        </h1>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex items-center gap-2 bg-[#526d82] px-4 py-2 rounded-lg border border-gray-100">
                                            <CalendarBlank
                                                size={20}
                                                className="text-white"
                                            />
                                            <span className="text-sm font-medium text-white">
                                                {new Date(
                                                    report.createdAt
                                                ).toLocaleString(
                                                    language === 'hu'
                                                        ? 'hu-HU'
                                                        : 'en-US'
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    <div className="lg:col-span-2 space-y-8">
                                        <div>
                                            <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4 border-b pb-2">
                                                <ChatCenteredText
                                                    size={24}
                                                    className="text-white"
                                                />
                                                {t('reportDetails.description')}
                                            </h3>
                                            <p className="text-white leading-relaxed whitespace-pre-wrap break-words bg-[#526d82] p-6 rounded-xl border border-dashed border-gray-200">
                                                {report.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-[#526d82] text-white p-6 rounded-2xl shadow-lg">
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                                <WarningCircle size={22} />{' '}
                                                {t('reportDetails.info')}
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                    <span className="text-white text-sm">
                                                        {t(
                                                            'reportDetails.priority'
                                                        )}
                                                    </span>
                                                    <span className="font-bold text-white">
                                                        {report.priority} / 5
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                                    <span className="text-white text-sm">
                                                        {t(
                                                            'reportDetails.reportedBy'
                                                        )}
                                                    </span>
                                                    <span className="font-bold text-white">
                                                        {report.reportedBy
                                                            ?.username || 'N/A'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-white text-sm">
                                                        {t(
                                                            'reportDetails.assignedTo'
                                                        )}
                                                    </span>
                                                    <span className="font-bold text-emerald-400">
                                                        {report.managedBy
                                                            ?.username ||
                                                            t(
                                                                'reportDetails.unassigned'
                                                            )}
                                                        {report.managedBy
                                                            ?.role &&
                                                            ` (${decideRole(report.managedBy.role)})`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {user.role !== 'user' && (
                                            <div className="flex flex-col gap-3">
                                                {report.managedBy === null && (
                                                    <button
                                                        onClick={() =>
                                                            assignToMaintainer(
                                                                report.id
                                                            )
                                                        }
                                                        disabled={loading}
                                                        className="w-full py-3 bg-[#526D82] hover:bg-blue-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                                    >
                                                        <CheckCircle
                                                            size={22}
                                                            weight="bold"
                                                        />
                                                        {t(
                                                            'reportDetails.assignButton'
                                                        )}
                                                    </button>
                                                )}

                                                {report.managedBy &&
                                                    String(
                                                        report.managedBy
                                                            .username
                                                    ) !==
                                                        String(
                                                            user?.username
                                                        ) &&
                                                    report.status ===
                                                        'in progress' && (
                                                        <div className="w-full py-4 px-6 bg-[#526D82] text-white font-bold rounded-xl flex items-center justify-center gap-3 border border-gray-200 uppercase text-xs tracking-widest shadow-md min-h-[64px]">
                                                            <XCircle
                                                                size={24}
                                                                weight="fill"
                                                                className="text-red-400 shrink-0"
                                                            />
                                                            <span className="text-center">
                                                                {t(
                                                                    'reportDetails.alreadyAssigned'
                                                                )}
                                                            </span>
                                                        </div>
                                                    )}

                                                {report.managedBy &&
                                                    String(
                                                        report.managedBy
                                                            .username
                                                    ) ===
                                                        String(
                                                            user?.username
                                                        ) &&
                                                    report.status ===
                                                        'in progress' && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        'done'
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                                            >
                                                                <CheckCircle
                                                                    size={22}
                                                                    weight="fill"
                                                                />
                                                                {t(
                                                                    'reportDetails.completeButton'
                                                                )}
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        'open'
                                                                    )
                                                                }
                                                                disabled={
                                                                    loading
                                                                }
                                                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                                                            >
                                                                <ArrowLeft
                                                                    size={22}
                                                                    weight="bold"
                                                                />
                                                                {t(
                                                                    'reportDetails.unassignButton'
                                                                )}
                                                            </button>
                                                        </>
                                                    )}

                                                {report.status === 'done' && (
                                                    <div className="w-full py-4 bg-[#526D82] text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-gray-200 uppercase text-xs tracking-widest text-center">
                                                        <CheckCircle
                                                            size={24}
                                                            className="text-emerald-500"
                                                            weight="fill"
                                                        />
                                                        {t(
                                                            'reportDetails.alreadyCompleted'
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
