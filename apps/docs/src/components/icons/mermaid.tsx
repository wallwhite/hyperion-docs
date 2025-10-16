import { type FC } from 'react';

interface MermaidIconProps {
  className?: string;
}

export const MermaidIcon: FC<MermaidIconProps> = ({ className }) => (
  <svg className={className} width="91" height="91" viewBox="0 0 91 91" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_5_29)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M90.8443 15.6813C90.8443 7.02646 83.8179 0 75.163 0H15.6813C7.02646 0 0 7.02646 0 15.6813V75.163C0 83.8179 7.02646 90.8443 15.6813 90.8443H75.163C83.8179 90.8443 90.8443 83.8179 90.8443 75.163V15.6813Z"
        fill="#FF3670"
      />
      <path
        d="M75.5207 20.6057C62.1964 20.0354 49.9616 28.2337 45.4222 40.7739C40.8827 28.2337 28.648 20.0354 15.3236 20.6057C14.8797 31.1789 19.9379 41.2617 28.6789 47.2273C33.1581 50.3037 35.8347 55.4064 35.8199 60.8403V70.2665H55.0263V60.8403C55.0107 55.4068 57.6868 50.3039 62.1654 47.2273C70.9088 41.264 75.9678 31.1796 75.5207 20.6057Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_5_29">
        <rect width="91" height="91" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
