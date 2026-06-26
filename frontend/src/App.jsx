import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RegisterPensioner from './components/RegisterPensioner';
import SearchProfile from './components/SearchProfile';
import BulkCreditEntry from './components/BulkCreditEntry';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="register" element={<RegisterPensioner />} />
        <Route path="search" element={<SearchProfile />} />
        <Route path="bulk-credit" element={<BulkCreditEntry />} />
      </Route>
    </Routes>
  );
}