import React from 'react';

const GBFlag = ({ width = 18, height = 12, className = '' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 60 40"
            className={className}
            aria-label="United Kingdom"
            role="img"
        >
            <rect width="60" height="40" fill="#012169" />
            <polygon points="0,0 6,0 60,34 60,40 54,40 0,6" fill="#fff" />
            <polygon points="60,0 60,6 6,40 0,40 0,34 54,0" fill="#fff" />
            <polygon points="0,0 3,0 60,37 60,40 57,40 0,3" fill="#C8102E" />
            <polygon points="60,0 60,3 3,40 0,40 0,37 57,0" fill="#C8102E" />
            <rect x="24" y="0" width="12" height="40" fill="#fff" />
            <rect x="0" y="14" width="60" height="12" fill="#fff" />
            <rect x="26" y="0" width="8" height="40" fill="#C8102E" />
            <rect x="0" y="16" width="60" height="8" fill="#C8102E" />
        </svg>
    );
};

export default GBFlag;
