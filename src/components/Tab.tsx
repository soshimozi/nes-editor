import React, { ReactNode } from 'react';

export type TabProps = {
  label: string;
  children: ReactNode;
};

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};
