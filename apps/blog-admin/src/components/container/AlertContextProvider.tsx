import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

export type Serverity = 'error' | 'warning' | 'info' | 'success' | '';

export interface AlertContextState {
  message: string;
  severity: Serverity;
}

export interface AlertContextBase extends AlertContextState {
  changeAlert: (alertData: AlertContextState) => void;
}

export const defaultAlertContext: AlertContextBase = {
  message: '',
  severity: '',
  changeAlert: () => {}
};

export const AlertContext = createContext<AlertContextBase>(defaultAlertContext);

interface AlertContextProps {
  children: ReactNode;
}
export function AlertContextProvider({ children }: AlertContextProps) {
  const [alert, setAlert] = useState<AlertContextState>({
    message: '',
    severity: ''
  });
  const value = useMemo<AlertContextBase>(
    () => ({
      message: alert.message,
      severity: alert.severity,
      changeAlert(alertData: AlertContextState) {
        setAlert(alertData);
      }
    }),
    [alert]
  );

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export const setAlert = (alert: AlertContextState) => {
  const { changeAlert } = useContext(AlertContext);
  return changeAlert(alert);
};

export const getAlert = () => {
  const { message, severity } = useContext(AlertContext);
  return {
    message,
    severity
  };
};
