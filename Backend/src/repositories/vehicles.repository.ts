import { query } from '../config/database';
import type { CreateVehicleInput, VehicleDetail } from '../types/models';

export async function create(data: CreateVehicleInput): Promise<number> {
  const { rows } = await query<{ vehicle_id: number }>(
    `SELECT sp_create_vehicle($1, $2, $3, $4, $5) AS vehicle_id`,
    [
      data.owner_id ?? null,
      data.license_plate ?? null,
      data.brand ?? null,
      data.model ?? null,
      data.color ?? null,
    ]
  );
  return rows[0].vehicle_id;
}

export async function findById(vehicleId: number): Promise<VehicleDetail | null> {
  const { rows } = await query<VehicleDetail>(`SELECT * FROM sp_get_vehicle($1)`, [vehicleId]);
  return rows[0] ?? null;
}

export async function searchByPlate(plate: string): Promise<VehicleDetail[]> {
  const { rows } = await query<VehicleDetail>(
    `SELECT * FROM sp_search_vehicles_by_plate($1)`,
    [plate]
  );
  return rows;
}

export async function update(vehicleId: number, data: CreateVehicleInput): Promise<boolean> {
  const { rows } = await query<{ updated: boolean }>(
    `SELECT sp_update_vehicle($1, $2, $3, $4, $5, $6) AS updated`,
    [
      vehicleId,
      data.owner_id ?? null,
      data.license_plate ?? null,
      data.brand ?? null,
      data.model ?? null,
      data.color ?? null,
    ]
  );
  return rows[0].updated;
}

export async function remove(vehicleId: number): Promise<boolean> {
  const { rows } = await query<{ deleted: boolean }>(
    `SELECT sp_delete_vehicle($1) AS deleted`,
    [vehicleId]
  );
  return rows[0].deleted;
}
