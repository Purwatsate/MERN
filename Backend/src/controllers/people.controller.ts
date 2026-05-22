import { Request, Response } from 'express';
import * as peopleRepo from '../repositories/people.repository';
import type { CreatePersonInput } from '../types/models';

export async function list(req: Request, res: Response): Promise<void> {
  const limit = parseInt(String(req.query.limit ?? '100'), 10);
  const offset = parseInt(String(req.query.offset ?? '0'), 10);
  const data = await peopleRepo.listAll(limit, offset);
  res.json({ success: true, data });
}

export async function search(req: Request, res: Response): Promise<void> {
  const keyword = (req.query.q ?? req.query.keyword) as string | undefined;
  if (!keyword) {
    res.status(400).json({ success: false, message: 'Search keyword (q) is required' });
    return;
  }
  const data = await peopleRepo.search(keyword);
  res.json({ success: true, data });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const person = await peopleRepo.findById(parseInt(req.params.id, 10));
  if (!person) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  res.json({ success: true, data: person });
}

export async function create(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<CreatePersonInput>;
  if (!body.full_name || !body.gender) {
    res.status(400).json({ success: false, message: 'full_name and gender are required' });
    return;
  }
  const id = await peopleRepo.create(body as CreatePersonInput);
  const person = await peopleRepo.findById(id);
  res.status(201).json({ success: true, data: person });
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id, 10);
  const existing = await peopleRepo.findById(id);
  if (!existing) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  const merged: CreatePersonInput = { ...existing, ...req.body };
  const updated = await peopleRepo.update(id, merged);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  const person = await peopleRepo.findById(id);
  res.json({ success: true, data: person });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const deleted = await peopleRepo.remove(parseInt(req.params.id, 10));
  if (!deleted) {
    res.status(404).json({ success: false, message: 'Person not found' });
    return;
  }
  res.json({ success: true, message: 'Person deleted' });
}
