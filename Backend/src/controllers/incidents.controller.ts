import { Request, Response } from 'express';
import * as incidentsRepo from '../repositories/incidents.repository';
import type { CreateIncidentInput, IncidentStatus } from '../types/models';

export async function list(req: Request, res: Response): Promise<void> {
  const status = (req.query.status as IncidentStatus | undefined) ?? null;
  const limit = parseInt(String(req.query.limit ?? '50'), 10);
  const offset = parseInt(String(req.query.offset ?? '0'), 10);
  const data = await incidentsRepo.list(status, limit, offset);
  res.json({ success: true, data });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const incident = await incidentsRepo.findById(parseInt(req.params.id, 10));
  if (!incident) {
    res.status(404).json({ success: false, message: 'Incident not found' });
    return;
  }
  res.json({ success: true, data: incident });
}

export async function create(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<CreateIncidentInput>;
  if (!body.case_number || !body.title || !body.incident_date || !body.location) {
    res.status(400).json({
      success: false,
      message: 'case_number, title, incident_date, and location are required',
    });
    return;
  }
  const id = await incidentsRepo.create(body as CreateIncidentInput);
  const incident = await incidentsRepo.findById(id);
  res.status(201).json({ success: true, data: incident });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const existing = await incidentsRepo.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: 'Incident not found' });
    return;
  }
  const merged: CreateIncidentInput = { ...existing, ...req.body };
  const updated = await incidentsRepo.update(id, merged);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Incident not found' });
    return;
  }
  const incident = await incidentsRepo.findById(id);
  res.json({ success: true, data: incident });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const deleted = await incidentsRepo.remove(parseInt(req.params.id, 10));
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Incident not found' });
    return;
  }
  res.json({ success: true, message: 'Incident deleted' });
}
