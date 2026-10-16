import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/common/MobileShell';
import { AuthScreens } from './screens/AuthScreens';
import { DashboardScreens } from './screens/DashboardScreens';
import { RoomScreens } from './screens/RoomScreens';
import { TenantScreens } from './screens/TenantScreens';
import { ContractScreens } from './screens/ContractScreens';
import { AssetScreens } from './screens/AssetScreens';
import { ReturnScreens } from './screens/ReturnScreens';
import { BillingScreens } from './screens/BillingScreens';
import { DebtScreens } from './screens/DebtScreens';
import { DepositScreens } from './screens/DepositScreens';
import { ReportScreens } from './screens/ReportScreens';
import { SettingScreens } from './screens/SettingScreens';

const MainRouter: React.FC = () => {
  const { currentScreenId, params, isAuthenticated } = useApp();
  const screenKey = `${currentScreenId}:${JSON.stringify(params)}`;
  const authScreens = ['START', 'LOGIN', 'FIRSTPASS', 'FORGOT', 'RESET', 'ACCOUNT'];

  if (!isAuthenticated && !authScreens.includes(currentScreenId)) {
    return <AuthScreens key={screenKey} />;
  }

  // Auth & Account screens
  if (authScreens.includes(currentScreenId)) {
    return <AuthScreens key={screenKey} />;
  }

  // Dashboard screens
  if (['HOME', 'MORE'].includes(currentScreenId)) {
    return <DashboardScreens key={screenKey} />;
  }

  // Room screens
  if (
    currentScreenId === 'ROOMS' ||
    currentScreenId.startsWith('ROOM_')
  ) {
    return <RoomScreens key={screenKey} />;
  }

  // Tenant screens
  if (
    currentScreenId === 'TENANTS' ||
    currentScreenId.startsWith('TENANT_')
  ) {
    return <TenantScreens key={screenKey} />;
  }

  // Contract screens
  if (
    currentScreenId === 'CONTRACTS' ||
    currentScreenId === 'RENTAL_TERMS' ||
    currentScreenId.startsWith('CONTRACT_')
  ) {
    return <ContractScreens key={screenKey} />;
  }

  // Asset screens
  if (
    currentScreenId === 'ASSET' ||
    currentScreenId.startsWith('ASSET_')
  ) {
    return <AssetScreens key={screenKey} />;
  }

  // Return & checkout screens
  if (
    currentScreenId === 'RETURN' ||
    currentScreenId.startsWith('RETURN_')
  ) {
    return <ReturnScreens key={screenKey} />;
  }

  // Billing & payment screens
  if (
    currentScreenId === 'PAY' ||
    currentScreenId.startsWith('PAY_')
  ) {
    return <BillingScreens key={screenKey} />;
  }

  // Overdue debt screens
  if (
    currentScreenId === 'DEBT' ||
    currentScreenId.startsWith('DEBT_')
  ) {
    return <DebtScreens key={screenKey} />;
  }

  // Deposit settlement screens
  if (
    currentScreenId === 'DEPOSIT' ||
    currentScreenId.startsWith('DEPOSIT_')
  ) {
    return <DepositScreens key={screenKey} />;
  }

  // Report screens
  if (
    currentScreenId === 'REPORTS' ||
    currentScreenId.startsWith('REPORT_')
  ) {
    return <ReportScreens key={screenKey} />;
  }

  // Setting screens
  if (
    currentScreenId === 'SETTINGS' ||
    currentScreenId.startsWith('SET_')
  ) {
    return <SettingScreens key={screenKey} />;
  }

  // Fallback to Dashboard
  return <DashboardScreens key={screenKey} />;
};

export default function App() {
  return (
    <AppProvider>
      <MobileShell>
        <MainRouter />
      </MobileShell>
    </AppProvider>
  );
}
