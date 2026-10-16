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
  const { currentScreenId } = useApp();

  // Auth & Account screens
  if (['START', 'LOGIN', 'FIRSTPASS', 'FORGOT', 'RESET', 'ACCOUNT'].includes(currentScreenId)) {
    return <AuthScreens />;
  }

  // Dashboard screens
  if (['HOME', 'MORE'].includes(currentScreenId)) {
    return <DashboardScreens />;
  }

  // Room screens
  if (
    currentScreenId === 'ROOMS' ||
    currentScreenId.startsWith('ROOM_')
  ) {
    return <RoomScreens />;
  }

  // Tenant screens
  if (
    currentScreenId === 'TENANTS' ||
    currentScreenId.startsWith('TENANT_')
  ) {
    return <TenantScreens />;
  }

  // Contract screens
  if (
    currentScreenId === 'CONTRACTS' ||
    currentScreenId === 'RENTAL_TERMS' ||
    currentScreenId.startsWith('CONTRACT_')
  ) {
    return <ContractScreens />;
  }

  // Asset screens
  if (
    currentScreenId === 'ASSET' ||
    currentScreenId.startsWith('ASSET_')
  ) {
    return <AssetScreens />;
  }

  // Return & checkout screens
  if (
    currentScreenId === 'RETURN' ||
    currentScreenId.startsWith('RETURN_')
  ) {
    return <ReturnScreens />;
  }

  // Billing & payment screens
  if (
    currentScreenId === 'PAY' ||
    currentScreenId.startsWith('PAY_')
  ) {
    return <BillingScreens />;
  }

  // Overdue debt screens
  if (
    currentScreenId === 'DEBT' ||
    currentScreenId.startsWith('DEBT_')
  ) {
    return <DebtScreens />;
  }

  // Deposit settlement screens
  if (
    currentScreenId === 'DEPOSIT' ||
    currentScreenId.startsWith('DEPOSIT_')
  ) {
    return <DepositScreens />;
  }

  // Report screens
  if (
    currentScreenId === 'REPORTS' ||
    currentScreenId.startsWith('REPORT_')
  ) {
    return <ReportScreens />;
  }

  // Setting screens
  if (
    currentScreenId === 'SETTINGS' ||
    currentScreenId.startsWith('SET_')
  ) {
    return <SettingScreens />;
  }

  // Fallback to Dashboard
  return <DashboardScreens />;
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
