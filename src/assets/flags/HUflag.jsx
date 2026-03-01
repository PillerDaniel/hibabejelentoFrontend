import React from 'react';

const HUFlag = ({ width = 18, height = 12, className = '' }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 3 2"
            className={className}
            aria-label="Hungary"
            role="img"
        >
            <rect width="3" height="2" fill="#fff" />
            <rect width="3" height="0.6666667" y="0" fill="#CE2939" />
            <rect width="3" height="0.6666667" y="1.3333333" fill="#477050" />
        </svg>
    );
};

export default HUFlag;
