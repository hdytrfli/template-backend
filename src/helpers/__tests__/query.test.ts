import qs from 'qs';
import { describe, expect, it } from 'vitest';

import { QueryHelper } from '@/helpers/query';

type FilterQuery = { filter: Record<string, unknown> };
const parse = (query: string) => qs.parse(query) as unknown as FilterQuery;

describe('QueryHelper', () => {
  describe('build', () => {
    it('converts a plain string value to a regex filter', () => {
      const query = 'filter[name]=john';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('converts the regex operator to $regex', () => {
      const query = 'filter[name][regex]=john';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('converts the ne operator to $ne', () => {
      const query = 'filter[status][ne]=inactive';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        status: {
          $ne: 'inactive',
        },
      });
    });

    it('converts the gte operator to $gte as a number', () => {
      const query = 'filter[age][gte]=18';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        age: {
          $gte: 18,
        },
      });
    });

    it('converts the gt operator to $gt as a number', () => {
      const query = 'filter[age][gt]=18';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        age: {
          $gt: 18,
        },
      });
    });

    it('converts the lte operator to $lte as a number', () => {
      const query = 'filter[age][lte]=65';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        age: {
          $lte: 65,
        },
      });
    });

    it('converts the lt operator to $lt as a number', () => {
      const query = 'filter[age][lt]=18';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        age: {
          $lt: 18,
        },
      });
    });

    it('converts the in operator to $in as an array', () => {
      const query = 'filter[role][in]=admin,user,mod';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        role: {
          $in: ['admin', 'user', 'mod'],
        },
      });
    });

    it('processes multiple fields with different operators', () => {
      const query = 'filter[name][regex]=john&filter[age][gte]=18&filter[age][lte]=65';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
        age: { $gte: 18, $lte: 65 },
      });
    });

    it('skips values that are not strings or plain objects', () => {
      const query = 'filter[name][regex]=john&filter[tags][]=a&filter[tags][]=b';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('combines a plain string with an operator-based filter', () => {
      const query = 'filter[status]=active&filter[age][gte]=21';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        status: {
          $regex: 'active',
          $options: 'i',
        },
        age: { $gte: 21 },
      });
    });

    it('ignores operators that are not in the known map', () => {
      const query = 'filter[name][unknown]=value';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({});
    });

    it('handles an empty filter', () => {
      const query = 'filter=';
      const parsed = parse(query);
      const result = QueryHelper.build(parsed.filter);

      expect(result).toEqual({
        //
      });
    });

    it('full pipeline: URL query string to cleaned MongoDB filter', () => {
      const query = 'filter[name][regex]=john&filter[status]=active&filter[age][gte]=21';
      const parsed = parse(query);

      const built = QueryHelper.build(parsed.filter);
      const cleaned = QueryHelper.clean(built, ['name', 'age']);

      expect(cleaned).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
        age: { $gte: 21 },
      });
    });
  });

  describe('clean', () => {
    it('returns the query as-is when no allowed fields are provided', () => {
      const query = 'filter[name]=john';
      const parsed = parse(query);

      const built = QueryHelper.build(parsed.filter);
      const result = QueryHelper.clean(built);

      expect(result).toEqual(built);
    });

    it('strips fields not in the allowed list', () => {
      const query = 'filter[name][regex]=john&filter[role][ne]=admin';
      const parsed = parse(query);

      const built = QueryHelper.build(parsed.filter);
      const result = QueryHelper.clean(built, ['name']);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('allows only the specified fields', () => {
      const query = 'filter[name][regex]=john&filter[age][gte]=18&filter[role][regex]=admin';
      const parsed = parse(query);

      const built = QueryHelper.build(parsed.filter);
      const result = QueryHelper.clean(built, ['name', 'role']);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
        role: {
          $regex: 'admin',
          $options: 'i',
        },
      });
    });

    it('returns an empty object when no fields are allowed', () => {
      const query = 'filter[name][regex]=john';
      const parsed = parse(query);
      const built = QueryHelper.build(parsed.filter);
      const result = QueryHelper.clean(built, ['email']);

      expect(result).toEqual({
        //
      });
    });
  });
});
