import type { Request } from 'express';
import { Types } from 'mongoose';
import * as z from 'zod';

import { NotFoundError } from '@/helpers/error';
import { QueryHelper } from '@/helpers/query';
import type { BaseRepository } from '@/repositories/base.repository';
import { SoftDeletableRepository } from '@/repositories/soft-deletable.repository';
import type { AppResponse, PaginatedResponse } from '@/types/response';
import type { FilterKeys } from '@/types/util';

const paramsSchema = z.object({
  id: z
    .string()
    .length(24)
    .refine((value) => {
      return Types.ObjectId.isValid(value);
    }),
});

const querySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(20),
  filter: z.record(z.string(), z.unknown()).optional().default({}),
});

/**
 * Generic controller for create, read, update and delete.
 */
export class BaseController<T, C extends Partial<T>, U extends Partial<T>> {
  constructor(
    protected repository: BaseRepository<T>,
    protected createSchema: z.ZodType<C>,
    protected updateSchema: z.ZodType<U>,
    protected filterFields: FilterKeys<T> = [],
  ) {}

  index = async (req: Request, res: PaginatedResponse<T>) => {
    const { page, limit, filter } = querySchema.parse(req.query);

    const built = QueryHelper.build(filter);
    const query = QueryHelper.clean(built, this.filterFields);
    const { data, pagination } = await this.repository.paginate({ page, limit }, query);

    return res.json({
      success: true,
      data,
      pagination,
    });
  };

  create = async (req: Request, res: AppResponse<T>) => {
    const data = this.createSchema.parse(req.body);
    const doc = await this.repository.create(data);

    return res.status(201).json({
      success: true,
      data: doc,
    });
  };

  findById = async (req: Request, res: AppResponse<T>) => {
    const { id } = paramsSchema.parse(req.params);

    const doc = await this.repository.findById(id);
    if (!doc) throw new NotFoundError('Resource');

    return res.json({
      success: true,
      data: doc,
    });
  };

  update = async (req: Request, res: AppResponse<T>) => {
    const { id } = paramsSchema.parse(req.params);

    const data = this.updateSchema.parse(req.body);
    const doc = await this.repository.update({ _id: id }, data);
    if (!doc) throw new NotFoundError('Resource');

    return res.json({
      success: true,
      data: doc,
    });
  };

  delete = async (req: Request, res: AppResponse<null>) => {
    const { id } = paramsSchema.parse(req.params);

    if (this.repository instanceof SoftDeletableRepository) {
      const user = new Types.ObjectId(req.user.sub);
      const doc = await this.repository.softDelete({ _id: id }, user);
      if (!doc) throw new NotFoundError('Resource');

      return res.json({
        success: true,
        message: 'Resource deleted',
      });
    }

    const doc = await this.repository.delete({ _id: id });
    if (!doc) throw new NotFoundError('Resource');

    return res.json({
      success: true,
      message: 'Resource deleted',
    });
  };
}
