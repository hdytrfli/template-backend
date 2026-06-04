import type { Request } from 'express';
import * as z from 'zod';

import { NotFoundError } from '@/helpers/error';
import { QueryHelper } from '@/helpers/query';
import type { AppResponse, PaginatedResult } from '@/helpers/response';
import type { BaseRepository } from '@/repositories/base.repository';

const paramsSchema = z.object({
  id: z.string().length(24),
});

const querySchema = z
  .object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().positive().max(100).default(20),
  })
  .catchall(z.string());

/**
 * Generic CRUD controller. Subclass with a model type, create schema, and update schema.
 */
export class BaseController<T, C extends Partial<T>, U extends Partial<T>> {
  constructor(
    protected repository: BaseRepository<T>,
    protected createSchema: z.ZodType<C>,
    protected updateSchema: z.ZodType<U>,
  ) {}

  async index(req: Request, res: AppResponse<PaginatedResult<T>>) {
    const { page, limit, ...filter } = querySchema.parse(req.query);

    const query = QueryHelper.clean(filter);
    const result = await this.repository.paginate({ page, limit }, query);

    res.json({
      success: true,
      data: result,
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
