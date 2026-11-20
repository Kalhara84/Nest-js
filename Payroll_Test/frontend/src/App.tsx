import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import EmployeeList from './page/EmployeeList';
import EmployeeForm from './page/EmployeeForm';
import EmployeeView from './page/EmployeeView';

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
