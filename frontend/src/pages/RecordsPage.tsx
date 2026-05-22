import { useState, type FormEvent } from 'react';
import * as recordsApi from '../api/records';
import { ApiError } from '../api/client';
import type { CriminalRecord, CriminalRole } from '../types';
import { COMMON, CRIMINAL_ROLE_LABELS, RECORDS } from '../constants/my';

export function RecordsPage() {
  const [list, setList] = useState<CriminalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState<'incident' | 'person'>('incident');
  const [filterId, setFilterId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    person_id: '',
    incident_id: '',
    role: 'Suspect' as CriminalRole,
    arrest_date: '',
    punishment: '',
  });

  const load = async () => {
    const id = parseInt(filterId, 10);
    if (!id) {
      setError('ID ထည့်သွင်းပါ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data =
        filterType === 'incident'
          ? await recordsApi.getRecordsByIncident(id)
          : await recordsApi.getRecordsByPerson(id);
      setList(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await recordsApi.createRecord({
        person_id: parseInt(form.person_id, 10),
        incident_id: parseInt(form.incident_id, 10),
        role: form.role,
        arrest_date: form.arrest_date || null,
        punishment: form.punishment || null,
      });
      setShowForm(false);
      if (filterId) await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(COMMON.confirmDelete)) return;
    try {
      await recordsApi.deleteRecord(id);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  return (
    <div className="page">
      <header className="page-header row">
        <div>
          <h2>{RECORDS.title}</h2>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
          {RECORDS.add}
        </button>
      </header>

      <div className="toolbar">
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as 'incident' | 'person')}>
          <option value="incident">{RECORDS.filterByIncident}</option>
          <option value="person">{RECORDS.filterByPerson}</option>
        </select>
        <input
          type="number"
          placeholder="ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />
        <button type="button" className="btn" onClick={load}>{COMMON.search}</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{RECORDS.add}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                {RECORDS.personId} *
                <input type="number" required value={form.person_id} onChange={(e) => setForm({ ...form, person_id: e.target.value })} />
              </label>
              <label>
                {RECORDS.incidentId} *
                <input type="number" required value={form.incident_id} onChange={(e) => setForm({ ...form, incident_id: e.target.value })} />
              </label>
              <label>
                {RECORDS.role} *
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as CriminalRole })}>
                  {Object.entries(CRIMINAL_ROLE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                {RECORDS.arrestDate}
                <input type="date" value={form.arrest_date} onChange={(e) => setForm({ ...form, arrest_date: e.target.value })} />
              </label>
              <label className="full">
                {RECORDS.punishment}
                <textarea value={form.punishment} onChange={(e) => setForm({ ...form, punishment: e.target.value })} rows={2} />
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
        <p className="empty">{filterId ? COMMON.noData : 'ရှာဖွေရန် ID ထည့်ပါ'}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>လူ</th>
                <th>အမှု</th>
                <th>{RECORDS.role}</th>
                <th>{RECORDS.arrestDate}</th>
                <th>{COMMON.actions}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.record_id}>
                  <td>{r.record_id}</td>
                  <td>{r.person_name ?? r.person_id} {r.nrc_number ? `(${r.nrc_number})` : ''}</td>
                  <td>{r.case_number ?? r.incident_title ?? r.incident_id}</td>
                  <td>{CRIMINAL_ROLE_LABELS[r.role]}</td>
                  <td>{r.arrest_date ?? '—'}</td>
                  <td>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(r.record_id)}>{COMMON.delete}</button>
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
