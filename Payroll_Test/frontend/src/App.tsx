import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeView from './pages/EmployeeView';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeView />} />
        <Route path="/employees/:id/edit" element={<EmployeeForm />} />
        <Route path="*" element={<Navigate to="/employees" replace />} />
      </Routes>
    </Layout>
  );
}
