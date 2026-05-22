import { useEffect, useState, type FormEvent } from 'react';
import * as peopleApi from '../api/people';
import { ApiError } from '../api/client';
import type { Gender, Person } from '../types';
import {
  COMMON,
  GENDER_LABELS,
  PEOPLE,
} from '../constants/my';

const emptyForm = {
  full_name: '',
  nrc_number: '',
  alias_name: '',
  date_of_birth: '',
  gender: 'M' as Gender,
  father_name: '',
  phone_number: '',
  current_address: '',
};

export function PeoplePage() {
  const [list, setList] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Person | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async (keyword?: string) => {
    setLoading(true);
    setError('');
    try {
      const data = keyword?.trim()
        ? await peopleApi.searchPeople(keyword.trim())
        : await peopleApi.getPeople();
      setList(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Person) => {
    setEditing(p);
    setForm({
      full_name: p.full_name,
      nrc_number: p.nrc_number ?? '',
      alias_name: p.alias_name ?? '',
      date_of_birth: p.date_of_birth?.slice(0, 10) ?? '',
      gender: p.gender,
      father_name: p.father_name ?? '',
      phone_number: p.phone_number ?? '',
      current_address: p.current_address ?? '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      nrc_number: form.nrc_number || null,
      alias_name: form.alias_name || null,
      date_of_birth: form.date_of_birth || null,
      father_name: form.father_name || null,
      phone_number: form.phone_number || null,
      current_address: form.current_address || null,
    };
    try {
      if (editing) {
        await peopleApi.updatePerson(editing.person_id, payload);
      } else {
        await peopleApi.createPerson(payload);
      }
      setShowForm(false);
      await load(search);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(COMMON.confirmDelete)) return;
    try {
      await peopleApi.deletePerson(id);
      await load(search);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  return (
    <div className="page">
      <header className="page-header row">
        <div>
          <h2>{PEOPLE.title}</h2>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          {PEOPLE.add}
        </button>
      </header>

      <div className="toolbar">
        <input
          type="search"
          placeholder={PEOPLE.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="button" className="btn" onClick={() => load(search)}>
          {COMMON.search}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); load(); }}>
          အားလုံးပြရန်
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? COMMON.edit : PEOPLE.add}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                {PEOPLE.fullName} *
                <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </label>
              <label>
                {PEOPLE.nrc}
                <input value={form.nrc_number} onChange={(e) => setForm({ ...form, nrc_number: e.target.value })} />
              </label>
              <label>
                {PEOPLE.alias}
                <input value={form.alias_name} onChange={(e) => setForm({ ...form, alias_name: e.target.value })} />
              </label>
              <label>
                {PEOPLE.dob}
                <input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
              </label>
              <label>
                {PEOPLE.gender} *
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value as Gender })}>
                  {Object.entries(GENDER_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </label>
              <label>
                {PEOPLE.fatherName}
                <input value={form.father_name} onChange={(e) => setForm({ ...form, father_name: e.target.value })} />
              </label>
              <label>
                {PEOPLE.phone}
                <input value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
              </label>
              <label className="full">
                {PEOPLE.address}
                <textarea value={form.current_address} onChange={(e) => setForm({ ...form, current_address: e.target.value })} rows={2} />
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
                <th>{PEOPLE.fullName}</th>
                <th>{PEOPLE.nrc}</th>
                <th>{PEOPLE.gender}</th>
                <th>{PEOPLE.phone}</th>
                <th>{COMMON.actions}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.person_id}>
                  <td>{p.person_id}</td>
                  <td>{p.full_name}</td>
                  <td>{p.nrc_number ?? '—'}</td>
                  <td>{GENDER_LABELS[p.gender]}</td>
                  <td>{p.phone_number ?? '—'}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-sm" onClick={() => openEdit(p)}>{COMMON.edit}</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(p.person_id)}>{COMMON.delete}</button>
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
