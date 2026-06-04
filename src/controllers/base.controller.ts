import type { Request } from 'express';
import * as z from 'zod';

import { NotFoundError } from '@/helpers/error';
import type { AppResponse } from '@/helpers/response';
import type { BaseRepository } from '@/repositories/base.repository';

const paramsSchema = z.object({
  id: z.string().length(24),
});

/**
 * Generic CRUD controller. Subclass with a model type, create schema, and update schema.
 */
export class BaseController<T, C extends Partial<T>, U extends Partial<T>> {
  constructor(
    protected repository: BaseRepository<T>,
    protected createSchema: z.ZodType<C>,
    protected updateSchema: z.ZodType<U>,
  ) {}

  async index(_req: Request, res: AppResponse<T[]>) {
    const docs = await this.repository.index();

    res.json({
      success: true,
      data: docs as T[],
    });
  }

  async create(req: Request, res: AppResponse<T>) {
    const data = this.createSchema.parse(req.body);
    const doc = await this.repository.create(data);

    res.status(201).json({
      success: true,
      data: doc as T,
    });
  }

  async findById(req: Request, res: AppResponse<T>) {
    const { id } = paramsSchema.parse(req.params);

    const doc = await this.repository.findById(id);
    if (!doc) throw new NotFoundError('Resource');

    res.json({
      success: true,
      data: doc as T,
    });
  }

  async update(req: Request, res: AppResponse<T>) {
    const { id } = paramsSchema.parse(req.params);

    const data = this.updateSchema.parse(req.body);
    const doc = await this.repository.update({ _id: id }, data);
    if (!doc) throw new NotFoundError('Resource');

    res.json({
      success: true,
      data: doc as T,
    });
  }

  async delete(req: Request, res: AppResponse<null>) {
    const { id } = paramsSchema.parse(req.params);

    const doc = await this.repository.delete({ _id: id });
    if (!doc) throw new NotFoundError('Resource');

    res.json({
      success: true,
      message: 'Deleted',
    });
  }
}
