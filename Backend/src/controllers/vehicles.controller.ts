import { Request, Response } from 'express';
import * as vehiclesRepo from '../repositories/vehicles.repository';
import type { CreateVehicleInput } from '../types/models';

export async function search(req: Request, res: Response): Promise<void> {
  const plate = (req.query.plate ?? req.query.q) as string | undefined;
  if (!plate) {
    res.status(400).json({ success: false, message: 'License plate (plate) is required' });
    return;
  }
  const data = await vehiclesRepo.searchByPlate(plate);
  res.json({ success: true, data });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const vehicle = await vehiclesRepo.findById(parseInt(req.params.id, 10));
  if (!vehicle) {
    res.status(404).json({ success: false, message: 'Vehicle not found' });
    return;
  }
  res.json({ success: true, data: vehicle });
}

export async function create(req: Request, res: Response): Promise<void> {
  const id = await vehiclesRepo.create(req.body as CreateVehicleInput);
  const vehicle = await vehiclesRepo.findById(id);
  res.status(201).json({ success: true, data: vehicle });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const existing = await vehiclesRepo.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: 'Vehicle not found' });
    return;
  }
  const body = req.body as Partial<CreateVehicleInput>;
  const updated = await vehiclesRepo.update(id, {
    owner_id: body.owner_id ?? existing.owner_id,
    license_plate: body.license_plate ?? existing.license_plate,
    brand: body.brand ?? existing.brand,
    model: body.model ?? existing.model,
    color: body.color ?? existing.color,
  });
  if (!updated) {
    res.status(404).json({ success: false, message: 'Vehicle not found' });
    return;
  }
  const vehicle = await vehiclesRepo.findById(id);
  res.json({ success: true, data: vehicle });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const deleted = await vehiclesRepo.remove(parseInt(req.params.id, 10));
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Vehicle not found' });
    return;
  }
  res.json({ success: true, message: 'Vehicle deleted' });
}
