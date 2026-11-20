import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import type { Employee, Paged } from '../types';

const CATEGORY: Record<string, string> = { W: 'Wages', E: 'Executive', S: 'Staff' };
const money = (n: number) => Number(n ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });

export default function EmployeeList() {
  const [result, setResult] = useState<Paged<Employee> | null>(null);
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  // search box -> wait a moment after typing stops
  useEffect(() => {
    const t = setTimeout(() => { setTerm(search); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setResult(await api.list(term, page));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [term, page]);

  useEffect(() => { load(); }, [load]);

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.remove(toDelete.empsno);
      setToDelete(null);
      // if we removed the last row of a page, go back one page
      if (result && result.data.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (e) {
      setError(errorMessage(e));
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <h4 className="m-0">Employees</h4>
          <div className="text-muted small">{result ? `${result.total} employees` : ' '}</div>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1" /> Add Employee
        </Link>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="card-soft">
        <div className="card-body-pad border-bottom" style={{ borderColor: 'var(--app-border)' }}>
          <div className="input-group" style={{ maxWidth: 380 }}>
            <span className="input-group-text bg-white"><i className="bi bi-search" /></span>
            <input
              className="form-control"
              placeholder="Search by name, employee no, NIC, designation"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-clean">
            <thead>
              <tr>
                <th>Emp No</th>
                <th>Name</th>
                <th>Category</th>
                <th>Department</th>
                <th>Location</th>
                <th>Designation</th>
                <th className="text-end">Basic Salary</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="text-center text-muted py-5">Loading...</td></tr>
              )}
              {!loading && result?.data.length === 0 && (
                <tr><td colSpan={9} className="text-center text-muted py-5">No employees found</td></tr>
              )}
              {!loading && result?.data.map((e) => (
                <tr key={e.empsno}>
                  <td className="fw-semibold">{e.empeno}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className="avatar">{(e.empnam || '?').charAt(0).toUpperCase()}</span>
                      <div>
                        <div className="fw-semibold">{e.empnam}</div>
                        <div className="text-muted small">{e.empidno}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-soft-blue">{CATEGORY[e.empcat] ?? e.empcat}</span></td>
                  <td>{e.department?.depdes ?? '-'}</td>
                  <td>{e.location?.locnam ?? '-'}</td>
                  <td>{e.empdesig || '-'}</td>
                  <td className="text-end">{money(e.empsal)}</td>
                  <td>
                    <span className={`badge ${e.empactflg === 'Y' ? 'badge-soft-green' : 'badge-soft-red'}`}>
                      {e.empactflg === 'Y' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <Link to={`/employees/${e.empsno}`} className="btn btn-outline-secondary btn-sm icon-btn me-1" title="View">
                      <i className="bi bi-eye" />
                    </Link>
                    <Link to={`/employees/${e.empsno}/edit`} className="btn btn-outline-primary btn-sm icon-btn me-1" title="Edit">
                      <i className="bi bi-pencil" />
                    </Link>
                    <button className="btn btn-outline-danger btn-sm icon-btn" title="Delete" onClick={() => setToDelete(e)}>
                      <i className="bi bi-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {result && result.totalPages > 1 && (
          <div className="card-body-pad d-flex justify-content-between align-items-center">
            <div className="text-muted small">Page {result.page} of {result.totalPages}</div>
            <div className="btn-group">
              <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <i className="bi bi-chevron-left" /> Prev
              </button>
              <button className="btn btn-outline-secondary btn-sm" disabled={page >= result.totalPages} onClick={() => setPage(page + 1)}>
                Next <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmModal
          title="Delete employee"
          message={`Delete ${toDelete.empnam} (Emp No ${toDelete.empeno})? This cannot be undone.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
