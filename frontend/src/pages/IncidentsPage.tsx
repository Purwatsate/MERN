import { useEffect, useState, type FormEvent } from 'react';
import * as incidentsApi from '../api/incidents';
import { ApiError } from '../api/client';
import type { Incident, IncidentStatus } from '../types';
import { COMMON, INCIDENTS, INCIDENT_STATUS_LABELS } from '../constants/my';

const emptyForm = {
  case_number: '',
  title: '',
  description: '',
  incident_date: '',
  location: '',
  status: 'Open' as IncidentStatus,
};

export function IncidentsPage() {
  const [list, setList] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | ''>('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Incident | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await incidentsApi.getIncidents(
        statusFilter || undefined
      );
      setList(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item: Incident) => {
    setEditing(item);
    setForm({
      case_number: item.case_number,
      title: item.title,
      description: item.description ?? '',
      incident_date: item.incident_date.slice(0, 16),
      location: item.location,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      description: form.description || null,
      incident_date: new Date(form.incident_date).toISOString(),
    };
    try {
      if (editing) {
        await incidentsApi.updateIncident(editing.incident_id, payload);
      } else {
        await incidentsApi.createIncident(payload);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(COMMON.confirmDelete)) return;
    try {
      await incidentsApi.deleteIncident(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  return (
    <div className="page">
      <header className="page-header row">
        <div>
          <h2>{INCIDENTS.title}</h2>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          {INCIDENTS.add}
        </button>
      </header>

      <div className="toolbar">
        <label>
          {INCIDENTS.status}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | '')}
          >
            <option value="">အားလုံး</option>
            {Object.entries(INCIDENT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? COMMON.edit : INCIDENTS.add}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                {INCIDENTS.caseNumber} *
                <input required value={form.case_number} onChange={(e) => setForm({ ...form, case_number: e.target.value })} />
              </label>
              <label>
                {INCIDENTS.incidentTitle} *
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label>
                {INCIDENTS.date} *
                <input type="datetime-local" required value={form.incident_date} onChange={(e) => setForm({ ...form, incident_date: e.target.value })} />
              </label>
              <label>
                {INCIDENTS.status}
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as IncidentStatus })}>
                  {Object.entries(INCIDENT_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="full">
                {INCIDENTS.location} *
                <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </label>
              <label className="full">
                {INCIDENTS.description}
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </label>
              <div className="form-actions full">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>{COMMON.cancel}</button>
                <button type="submit" className="btn btn-primary">{COMMON.save}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>{COMMON.loading}</p>
      ) : list.length === 0 ? (
        <p className="empty">{COMMON.noData}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{INCIDENTS.caseNumber}</th>
                <th>{INCIDENTS.incidentTitle}</th>
                <th>{INCIDENTS.date}</th>
                <th>{INCIDENTS.status}</th>
                <th>{COMMON.actions}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.incident_id}>
                  <td>{item.incident_id}</td>
                  <td>{item.case_number}</td>
                  <td>{item.title}</td>
                  <td>{new Date(item.incident_date).toLocaleString('my-MM')}</td>
                  <td><span className="badge">{INCIDENT_STATUS_LABELS[item.status]}</span></td>
                  <td className="actions">
                    <button type="button" className="btn btn-sm" onClick={() => openEdit(item)}>{COMMON.edit}</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(item.incident_id)}>{COMMON.delete}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
