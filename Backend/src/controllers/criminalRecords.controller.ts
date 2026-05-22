import { Request, Response } from 'express';
import * as recordsRepo from '../repositories/criminalRecords.repository';
import type { CreateCriminalRecordInput } from '../types/models';

export async function getById(req: Request, res: Response): Promise<void> {
  const record = await recordsRepo.findById(parseInt(req.params.id, 10));
  if (!record) {
    res.status(404).json({ success: false, message: 'Criminal record not found' });
    return;
  }
  res.json({ success: true, data: record });
}

export async function listByIncident(req: Request, res: Response): Promise<void> {
  const data = await recordsRepo.listByIncident(parseInt(req.params.incidentId, 10));
  res.json({ success: true, data });
}

export async function listByPerson(req: Request, res: Response): Promise<void> {
  const data = await recordsRepo.listByPerson(parseInt(req.params.personId, 10));
  res.json({ success: true, data });
}

export async function create(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<CreateCriminalRecordInput>;
  if (!body.person_id || !body.incident_id || !body.role) {
    res.status(400).json({
      success: false,
      message: 'person_id, incident_id, and role are required',
    });
    return;
  }
  const id = await recordsRepo.create(body as CreateCriminalRecordInput);
  const record = await recordsRepo.findById(id);
  res.status(201).json({ success: true, data: record });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const deleted = await recordsRepo.remove(parseInt(req.params.id, 10));
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Criminal record not found' });
    return;
  }
  res.json({ success: true, message: 'Criminal record deleted' });
}
