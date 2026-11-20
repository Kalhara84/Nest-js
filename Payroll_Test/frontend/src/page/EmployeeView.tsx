import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import { useLookups } from '../components/useLookups';
import type { Employee, SysItem } from '../types';

const CATEGORY: Record<string, string> = { W: 'Wages', E: 'Executive', S: 'Staff' };
const yn = (v: string) => (v === 'Y' ? 'Yes' : v === 'N' ? 'No' : v || '-');

function Item({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="col-6 col-md-4 col-lg-3 detail-item">
      <div className="k">{label}</div>
      <div className="v">{value === null || value === undefined || value === '' ? '-' : value}</div>
    </div>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="card-soft mb-3">
      <div className="card-head"><i className={`bi ${icon}`} /> {title}</div>
      <div className="card-body-pad"><div className="row g-3">{children}</div></div>
    </div>
  );
}

export default function EmployeeView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lookups = useLookups();
  const [emp, setEmp] = useState<Employee | null>(null);
  const [error, setError] = useState('');
  const [askDelete, setAskDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(Number(id)).then(setEmp).catch((e) => setError(errorMessage(e)));
  }, [id]);

  async function doDelete() {
    if (!emp) return;
    setDeleting(true);
    try {
      await api.remove(emp.empsno);
      navigate('/employees');
    } catch (e) {
      setError(errorMessage(e));
      setAskDelete(false);
      setDeleting(false);
    }
  }

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!emp) return <div className="text-muted">Loading...</div>;

  const name = (list: SysItem[] | undefined, key: number | null, field: 'sysdes' | 'sysrno' = 'sysdes') =>
    list?.find((x) => x.syssno === key)?.[field];

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="d-flex align-items-center gap-3">
          <span className="avatar" style={{ width: 52, height: 52, fontSize: '1.2rem' }}>
            {emp.empnam.charAt(0).toUpperCase()}
          </span>
          <div>
            <h4 className="m-0">{emp.empnam}</h4>
            <div className="text-muted small">Emp No {emp.empeno} &middot; {emp.empdesig || 'No designation'}</div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/employees" className="btn btn-light"><i className="bi bi-arrow-left me-1" />Back</Link>
          <Link to={`/employees/${emp.empsno}/edit`} className="btn btn-primary"><i className="bi bi-pencil me-1" />Edit</Link>
          <button className="btn btn-outline-danger" onClick={() => setAskDelete(true)}><i className="bi bi-trash me-1" />Delete</button>
        </div>
      </div>

      <Section icon="bi-person" title="Personal">
        <Item label="Initial" value={emp.empinital} />
        <Item label="Employee Name" value={emp.empnam} />
        <Item label="Sex" value={emp.empmof === 'M' ? 'Male' : emp.empmof === 'F' ? 'Female' : emp.empmof} />
        <Item label="Married" value={yn(emp.empmrdtst)} />
        <Item label="National ID" value={emp.empidno} />
        <Item label="Passport No" value={emp.emppasportno} />
        <Item label="Date of Birth" value={emp.empdob} />
        <Item label="Status" value={emp.empsts} />
      </Section>

      <Section icon="bi-briefcase" title="Job">
        <Item label="Category" value={CATEGORY[emp.empcat] ?? emp.empcat} />
        <Item label="Designation" value={emp.empdesig} />
        <Item label="Department" value={emp.department?.depdes} />
        <Item label="Location" value={emp.location?.locnam} />
        <Item label="Section" value={name(lookups?.sections, emp.empsecsno)} />
        <Item label="Area" value={name(lookups?.areas, emp.emparesno)} />
        <Item label="Cost Center" value={name(lookups?.costCenters, emp.empcossno, 'sysrno')} />
        <Item label="Basis" value={name(lookups?.basis, emp.empbasisno)} />
        <Item label="Date Joined" value={emp.empjoin} />
        <Item label="Date Left" value={emp.empleft} />
        <Item label="Map Code" value={emp.empmapcode} />
        <Item label="Active" value={yn(emp.empactflg)} />
      </Section>

      <Section icon="bi-cash-stack" title="Salary & Statutory">
        <Item label="Basic Salary" value={emp.empsal} />
        <Item label="E.P.F" value={yn(emp.empepfyn)} />
        <Item label="E.P.F #" value={emp.empepfno} />
        <Item label="PAYE" value={yn(emp.emppayeyn)} />
        <Item label="Tax Table No" value={emp.emptno} />
        <Item label="PAYE Relief" value={emp.empprl} />
        <Item label="Up To Date Gross Earnings" value={emp.empgin} />
        <Item label="Up To Date Tax" value={emp.emptax} />
        <Item label="TIN No" value={emp.emptin} />
        <Item label="Coin Op Bal" value={emp.empcob} />
        <Item label="Service Charge %" value={emp.empscgpcn} />
      </Section>

      <Section icon="bi-bank" title="Bank">
        <Item label="Bank A/C #" value={emp.empbnkacno} />
        <Item label="Bank Code" value={emp.empbnkcode} />
        <Item label="Bank Branch" value={emp.empbnkbranch} />
        <Item label="Bank Id" value={emp.empbnkid} />
      </Section>

      <Section icon="bi-telephone" title="Contact">
        <Item label="Address" value={[emp.empad1, emp.empad2, emp.empad3, emp.empad4].filter(Boolean).join(', ')} />
        <Item label="Email" value={emp.empemail} />
        <Item label="Telephone" value={emp.emptel} />
      </Section>

      <Section icon="bi-calendar-check" title="Leave & Flags">
        <Item label="Annual" value={emp.empanual} />
        <Item label="Casual" value={emp.empcasal} />
        <Item label="L/L" value={emp.empleuleu} />
        <Item label="OT" value={yn(emp.empotflg)} />
        <Item label="No Pay" value={yn(emp.empnopflg)} />
        <Item label="Attendance Incentive" value={yn(emp.empattincflg)} />
        <Item label="Late" value={yn(emp.emplateflg)} />
        <Item label="Sat Leave" value={yn(emp.empnsatlflg)} />
      </Section>

      {askDelete && (
        <ConfirmModal
          title="Delete employee"
          message={`Delete ${emp.empnam} (Emp No ${emp.empeno})? This cannot be undone.`}
          busy={deleting}
          onConfirm={doDelete}
          onCancel={() => setAskDelete(false)}
        />
      )}
    </>
  );
}
