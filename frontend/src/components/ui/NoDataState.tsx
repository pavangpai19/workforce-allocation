import React from 'react';

export interface NoDataStateProps {
  message?: string;
}

export const NoDataState: React.FC<NoDataStateProps> = ({ message = 'No data available' }) => {
  return <span className="text-slate-500 italic text-xs">{message}</span>;
};
