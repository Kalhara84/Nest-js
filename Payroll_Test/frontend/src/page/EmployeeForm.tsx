import { useEffect, useState } from 'react';
import type { FormEvent, InputHTMLAttributes, ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import { useLookups } from '../components/useLookups';
import type { Employee } from '../types';

type FormState = Record<string, string>;

// how each field is converted before it is sent to the API
const INT_FIELDS = [
  'empeno', 'empmapcode', 'empepfno', 'emptno',
  'emplocsno', 'empdepsno', 'empsecsno', 'emparesno', 'empcossno', 'empbasisno',
];
const FLOAT_FIELDS = ['empsal', 'empscgpcn', 'empprl', 'emptax', 'empgin', 'empcob'];
const DATE_FIELDS = ['empdob', 'empjoin', 'empleft'];
const TEXT_FIELDS = [
  'empinital', 'empnam', 'empcat', 'empsts', 'empmof', 'empmrdtst', 'empidno', 'emppasportno', 'empdesig', 'emptin',
  'empbnkacno', 'empbnkcode', 'empbnkbranch', 'empbnkid', 'empad1', 'empad2', 'empad3', 'empad4', 'empemail', 'emptel',
  'empanual', 'empcasal', 'empleuleu',
  'empactflg', 'empepfyn', 'emppayeyn', 'empotflg', 'empnopflg', 'empattincflg', 'emplateflg', 'empnsatlflg',
];
const ALL_FIELDS = [...INT_FIELDS, ...FLOAT_FIELDS, ...DATE_FIELDS, ...TEXT_FIELDS];

const DEFAULTS: FormState = {
  empcat: 'W', empmof: 'M', empmrdtst: 'N',
  empactflg: 'Y', empepfyn: 'Y', emppayeyn: 'N',
  empotflg: 'N', empnopflg: 'N', empattincflg: 'N', emplateflg: 'N', empnsatlflg: 'N',
  empsal: '0', empscgpcn: '0', empprl: '0', emptax: '0', empgin: '0', empcob: '0', emptno: '0', empepfno: '0',
};

function emptyForm(): FormState {
  const f: FormState = {};
  ALL_FIELDS.forEach((k) => (f[k] = DEFAULTS[k] ?? ''));
  return f;
}

function fromEmployee(e: Employee): FormState {
  const f: FormState = {};
  const rec = e as unknown as Record<string, unknown>;
  ALL_FIELDS.forEach((k) => {
    const v = rec[k];
    f[k] = v === null || v === undefined ? '' : String(v).trim();
  });
  return f;
}

function toPayload(f: FormState): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  INT_FIELDS.forEach((k) => (body[k] = f[k] === '' ? null : parseInt(f[k], 10)));
  FLOAT_FIELDS.forEach((k) => (body[k] = f[k] === '' ? 0 : parseFloat(f[k])));
  DATE_FIELDS.forEach((k) => (body[k] = f[k] === '' ? null : f[k]));
  TEXT_FIELDS.forEach((k) => (body[k] = f[k].trim()));
  return body;
}

/* ---------- small field helpers ---------- */
function Col({ label, children, size = 'col-md-6 col-lg-4' }: { label: string; children: ReactNode; size?: string }) {
  return (
    <div className={size}>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function Card({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <div className="card-soft mb-3">
      <div className="card-head"><i className={`bi ${icon}`} /> {title}</div>
      <div className="card-body-pad"><div className="row g-3">{children}</div></div>
    </div>
  );
}

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const lookups = useLookups();

  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    // New employees use the next number from the API. Editing keeps the saved number.
    const request = isEdit
      ? api.get(Number(id)).then(fromEmployee)
      : api.nextEmployeeNumber().then(({ empeno }) => ({ ...emptyForm(), empeno: String(empeno) }));
    request
      .then((values) => { if (active) setForm(values); })
      .catch((e) => { if (active) setError(errorMessage(e)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, isEdit]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const bind = (k: string) => ({
    value: form[k] ?? '',
    onChange: (e: { target: { value: string } }) => set(k, e.target.value),
  });

  const text = (k: string, extra: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input className="form-control" {...bind(k)} {...extra} />
  );
  const num = (k: string, step = '1') => (
    <input className="form-control" type="number" step={step} {...bind(k)} />
  );
  const date = (k: string) => <input className="form-control" type="date" {...bind(k)} />;

  const select = (k: string, options: { value: string | number; label: string }[]) => (
    <select className="form-select" {...bind(k)}>
      <option value="">-- Select --</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const radios = (k: string, options: { value: string; label: string }[]) => (
    <div className="d-flex gap-3 pt-1">
      {options.map((o) => (
        <div className="form-check" key={o.value}>
          <input
            className="form-check-input" type="radio" name={k} id={`${k}-${o.value}`}
            checked={form[k] === o.value} onChange={() => set(k, o.value)}
          />
          <label className="form-check-label" htmlFor={`${k}-${o.value}`}>{o.label}</label>
        </div>
      ))}
    </div>
  );
  const yesNo = (k: string) => radios(k, [{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }]);

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setError('');
    if (!form.empeno) return setError('Employee No is required');
    if (!form.empnam.trim()) return setError('Employee Name is required');

    setSaving(true);
    try {
      const body = toPayload(form);
      if (isEdit) await api.update(Number(id), body);
      else await api.create(body);
      navigate('/employees');
    } catch (e) {
      setError(errorMessage(e));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted">Loading...</div>;

  return (
    <form onSubmit={onSubmit}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div>
          <h4 className="m-0">{isEdit ? 'Edit Employee' : 'Add Employee'}</h4>
          <div className="text-muted small">Fields marked * are required</div>
        </div>
        <div className="d-flex gap-2">
          <Link to="/employees" className="btn btn-light">Cancel</Link>
          <button className="btn btn-primary" disabled={saving}>
            <i className="bi bi-check-lg me-1" />{saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <Card icon="bi-person" title="Personal">
        <Col label="Employee No *">
          {/* The API supplies this number. Users cannot change it. */}
          <input className="form-control" type="text" value={form.empeno ?? ''} readOnly />
        </Col>
        <Col label="Initial">{text('empinital', { maxLength: 20 })}</Col>
        <Col label="Employee Name *">{text('empnam', { maxLength: 80 })}</Col>
        <Col label="Sex">{radios('empmof', [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }])}</Col>
        <Col label="Married">{yesNo('empmrdtst')}</Col>
        <Col label="National ID">{text('empidno', { maxLength: 20 })}</Col>
        <Col label="Passport No">{text('emppasportno', { maxLength: 15 })}</Col>
        <Col label="Date of Birth">{date('empdob')}</Col>
      </Card>

      <Card icon="bi-briefcase" title="Job">
        <Col label="Category">
          {radios('empcat', [
            { value: 'W', label: 'Wages' }, { value: 'E', label: 'Executive' }, { value: 'S', label: 'Staff' },
          ])}
        </Col>
        <Col label="Designation">{text('empdesig', { maxLength: 60 })}</Col>
        <Col label="Location">
          {select('emplocsno', (lookups?.locations ?? []).map((l) => ({ value: l.locsno, label: l.locnam ?? l.locloc })))}
        </Col>
        <Col label="Department">
          {select('empdepsno', (lookups?.departments ?? []).map((d) => ({ value: d.depsno, label: d.depdes ?? d.depdep })))}
        </Col>
        <Col label="Section">
          {select('empsecsno', (lookups?.sections ?? []).map((s) => ({ value: s.syssno, label: s.sysdes })))}
        </Col>
        <Col label="Area">
          {select('emparesno', (lookups?.areas ?? []).map((s) => ({ value: s.syssno, label: s.sysdes })))}
        </Col>
        <Col label="Cost Center">
          {select('empcossno', (lookups?.costCenters ?? []).map((s) => ({ value: s.syssno, label: s.sysrno })))}
        </Col>
        <Col label="Basis">
          {select('empbasisno', (lookups?.basis ?? []).map((s) => ({ value: s.syssno, label: s.sysdes })))}
        </Col>
        <Col label="Date Joined">{date('empjoin')}</Col>
        <Col label="Date Left">{date('empleft')}</Col>
        <Col label="Map Code">{num('empmapcode')}</Col>
        <Col label="Status">{text('empsts', { maxLength: 1, style: { textTransform: 'uppercase' } })}</Col>
        <Col label="Active">{yesNo('empactflg')}</Col>
      </Card>

      <Card icon="bi-cash-stack" title="Salary & Statutory">
        <Col label="Basic Salary">{num('empsal', '0.01')}</Col>
        <Col label="Service Charge %">{num('empscgpcn', '0.01')}</Col>
        <Col label="E.P.F">{yesNo('empepfyn')}</Col>
        <Col label="E.P.F #">{num('empepfno')}</Col>
        <Col label="PAYE">{yesNo('emppayeyn')}</Col>
        <Col label="Tax Table No">{num('emptno')}</Col>
        <Col label="PAYE Relief">{num('empprl', '0.01')}</Col>
        <Col label="Up To Date Gross Earnings">{num('empgin', '0.01')}</Col>
        <Col label="Up To Date Tax">{num('emptax', '0.01')}</Col>
        <Col label="TIN No">{text('emptin', { maxLength: 18 })}</Col>
        <Col label="Coin Op Bal">{num('empcob', '0.01')}</Col>
      </Card>

      <Card icon="bi-bank" title="Bank">
        <Col label="Bank A/C #">{text('empbnkacno', { maxLength: 30 })}</Col>
        <Col label="Bank Code">{text('empbnkcode', { maxLength: 20 })}</Col>
        <Col label="Bank Branch">{text('empbnkbranch', { maxLength: 20 })}</Col>
        <Col label="Bank Id">{text('empbnkid', { maxLength: 20 })}</Col>
      </Card>

      <Card icon="bi-telephone" title="Contact">
        <Col label="Address Line 1">{text('empad1', { maxLength: 40 })}</Col>
        <Col label="Address Line 2">{text('empad2', { maxLength: 40 })}</Col>
        <Col label="Address Line 3">{text('empad3', { maxLength: 40 })}</Col>
        <Col label="Address Line 4">{text('empad4', { maxLength: 40 })}</Col>
        <Col label="Email">{text('empemail', { type: 'email', maxLength: 40 })}</Col>
        <Col label="Telephone">{text('emptel', { maxLength: 25 })}</Col>
      </Card>

      <Card icon="bi-calendar-check" title="Leave & Flags">
        <Col label="Annual" size="col-6 col-lg-2">{text('empanual', { maxLength: 4 })}</Col>
        <Col label="Casual" size="col-6 col-lg-2">{text('empcasal', { maxLength: 4 })}</Col>
        <Col label="L/L" size="col-6 col-lg-2">{text('empleuleu', { maxLength: 4 })}</Col>
        <div className="w-100" />
        <Col label="OT" size="col-6 col-lg-2">{yesNo('empotflg')}</Col>
        <Col label="No Pay" size="col-6 col-lg-2">{yesNo('empnopflg')}</Col>
        <Col label="Attendance Incentive" size="col-6 col-lg-3">{yesNo('empattincflg')}</Col>
        <Col label="Late" size="col-6 col-lg-2">{yesNo('emplateflg')}</Col>
        <Col label="Sat Leave" size="col-6 col-lg-2">{yesNo('empnsatlflg')}</Col>
      </Card>

      <div className="d-flex justify-content-end gap-2">
        <Link to="/employees" className="btn btn-light">Cancel</Link>
        <button className="btn btn-primary" disabled={saving}>
          <i className="bi bi-check-lg me-1" />{saving ? 'Saving...' : isEdit ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
}
