import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ArrowFatLineRight } from 'phosphor-react';

const NotFound = () => {
    const { t, i18n } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center text-sm max-md:px-4 py-20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#27374D] to-[#526d82] bg-clip-text text-transparent leading-tight">
                {t('notFound.title')}
            </h1>
            <div className="h-px w-80 rounded bg-gradient-to-r from-[#27374D] to-[#526d82] my-5 md:my-7" />
            <p className="md:text-xl text-[#DDE6ED] max-w-lg text-center">
                {t('notFound.message')}
            </p>
            <Link
                to="/"
                className="group flex items-center gap-1 bg-[#27374D] hover:bg-[#526d82] px-7 py-2.5 text-white rounded-full mt-10 font-medium active:scale-95 transition-all"
            >
                {t('notFound.buttontext')}
                <ArrowFatLineRight size={22} />
            </Link>
        </div>
    );
};

export default NotFound;
