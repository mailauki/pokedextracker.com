import classNames from 'classnames';

import type { ReactNode } from 'react';

import { Alert as Alerts } from '@mui/material';

interface Props {
  className?: string;
  message: ReactNode;
  type: 'error' | 'success';
}

export function Alert ({ className, message, type }: Props) {
  if (!message) {
    return null;
  }

  return (
    // <div className={classNames('alert', `alert-${type}`, className)} style={{ borderRadius: '4px' }}>
    //   {message}
    // </div>
    <Alerts severity={type}>{message}</Alerts>
  );
}
