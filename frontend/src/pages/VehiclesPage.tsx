import { useState, type FormEvent } from 'react';
import * as vehiclesApi from '../api/vehicles';
import { ApiError } from '../api/client';
import type { Vehicle } from '../types';
import { COMMON, VEHICLES } from '../constants/my';

const emptyForm = {
  owner_id: '',
  license_plate: '',
  brand: '',
  model: '',
  color: '',
};

export function VehiclesPage() {
  const [list, setList] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [plateSearch, setPlateSearch] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState(emptyForm);

  const search = async () => {
    if (!plateSearch.trim()) {
      setError('နံပါတ်ပြား ထည့်သွင်းပါ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await vehiclesApi.searchVehicles(plateSearch.trim());
      setList(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      owner_id: v.owner_id?.toString() ?? '',
      license_plate: v.license_plate ?? '',
      brand: v.brand ?? '',
      model: v.model ?? '',
      color: v.color ?? '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      owner_id: form.owner_id ? parseInt(form.owner_id, 10) : null,
      license_plate: form.license_plate || null,
      brand: form.brand || null,
      model: form.model || null,
      color: form.color || null,
    };
    try {
      if (editing) {
        await vehiclesApi.updateVehicle(editing.vehicle_id, payload);
      } else {
        await vehiclesApi.createVehicle(payload);
      }
      setShowForm(false);
      if (plateSearch.trim()) await search();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(COMMON.confirmDelete)) return;
    try {
      await vehiclesApi.deleteVehicle(id);
      if (plateSearch.trim()) await search();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : COMMON.error);
    }
  };

  return (
    <div className="page">
      <header className="page-header row">
        <div>
          <h2>{VEHICLES.title}</h2>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          {VEHICLES.add}
        </button>
      </header>

      <div className="toolbar">
        <input
          type="search"
          placeholder={VEHICLES.searchPlate}
          value={plateSearch}
          onChange={(e) => setPlateSearch(e.target.value)}
        />
        <button type="button" className="btn" onClick={search}>{COMMON.search}</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editing ? COMMON.edit : VEHICLES.add}</h3>
            <form onSubmit={handleSubmit} className="form-grid">
              <label>
                {VEHICLES.ownerId}
                <input type="number" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })} />
              </label>
              <label>
                {VEHICLES.plate}
                <input value={form.license_plate} onChange={(e) => setForm({ ...form, license_plate: e.target.value })} />
              </label>
              <label>
                {VEHICLES.brand}
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </label>
              <label>
                {VEHICLES.model}
                <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </label>
              <label>
                {VEHICLES.color}
                <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
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
        <p className="empty">{plateSearch ? COMMON.noData : 'နံပါတ်ပြားဖြင့် ရှာဖွေပါ'}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>{VEHICLES.plate}</th>
                <th>{VEHICLES.brand}</th>
                <th>{VEHICLES.model}</th>
                <th>ပိုင်ရှင်</th>
                <th>{COMMON.actions}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((v) => (
                <tr key={v.vehicle_id}>
                  <td>{v.vehicle_id}</td>
                  <td>{v.license_plate ?? '—'}</td>
                  <td>{v.brand ?? '—'}</td>
                  <td>{v.model ?? '—'}</td>
                  <td>{v.owner_name ?? v.owner_id ?? '—'}</td>
                  <td className="actions">
                    <button type="button" className="btn btn-sm" onClick={() => openEdit(v)}>{COMMON.edit}</button>
                    <button type="button" className="btn btn-sm btn-danger" onClick={() => handleDelete(v.vehicle_id)}>{COMMON.delete}</button>
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
