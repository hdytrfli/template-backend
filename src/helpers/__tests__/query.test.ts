import qs from 'qs';
import { describe, expect, it } from 'vitest';

import { QueryHelper } from '@/helpers/query';

const parse = (url: string) => qs.parse(new URL(url).search.slice(1)) as any;

describe('QueryHelper', () => {
  describe('parseFilter', () => {
    it('converts a plain string value to a regex filter', () => {
      const { filter } = parse('http://example.com?filter[name]=john');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('converts the ne operator to $ne', () => {
      const { filter } = parse('http://example.com?filter[status][ne]=inactive');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        status: {
          $ne: 'inactive',
        },
      });
    });

    it('converts the gte operator to $gte as a number', () => {
      const { filter } = parse('http://example.com?filter[age][gte]=18');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        age: {
          $gte: 18,
        },
      });
    });

    it('converts the gt operator to $gt as a number', () => {
      const { filter } = parse('http://example.com?filter[age][gt]=18');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        age: {
          $gt: 18,
        },
      });
    });

    it('converts the lte operator to $lte as a number', () => {
      const { filter } = parse('http://example.com?filter[age][lte]=65');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        age: {
          $lte: 65,
        },
      });
    });

    it('converts the lt operator to $lt as a number', () => {
      const { filter } = parse('http://example.com?filter[age][lt]=18');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        age: {
          $lt: 18,
        },
      });
    });

    it('converts the in operator to $in as an array', () => {
      const { filter } = parse('http://example.com?filter[role][in]=admin,user,mod');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        role: {
          $in: ['admin', 'user', 'mod'],
        },
      });
    });

    it('processes multiple fields with different operators', () => {
      const { filter } = parse(
        'http://example.com?filter[name][regex]=john&filter[age][gte]=18&filter[age][lte]=65',
      );
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
        age: {
          $gte: 18,
          $lte: 65,
        },
      });
    });

    it('skips values that are not strings or plain objects', () => {
      const { filter } = parse(
        'http://example.com?filter[name][regex]=john&filter[tags][]=a&filter[tags][]=b',
      );
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('combines a plain string with an operator-based filter', () => {
      const { filter } = parse('http://example.com?filter[status]=active&filter[age][gte]=21');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        status: {
          $regex: 'active',
          $options: 'i',
        },
        age: {
          $gte: 21,
        },
      });
    });

    it('ignores operators that are not in the known map', () => {
      const { filter } = parse('http://example.com?filter[name][unknown]=value');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        //
      });
    });

    it('handles an empty filter', () => {
      const { filter } = parse('http://example.com');
      const result = QueryHelper.parseFilter(filter ?? {});

      expect(result).toEqual({
        //
      });
    });

    it('full pipeline: URL query string to cleaned MongoDB filter', () => {
      const { filter } = parse(
        'http://example.com?filter[name][regex]=john&filter[status]=active&filter[age][gte]=21',
      );

      const built = QueryHelper.parseFilter(filter);
      const cleaned = QueryHelper.sanitizeFilter(built, ['name', 'age']);

      expect(cleaned).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
        age: {
          $gte: 21,
        },
      });
    });
  });

  describe('parseSort', () => {
    it('returns undefined when no sort param', () => {
      const { sort } = parse('http://example.com');
      const result = QueryHelper.parseSort(sort);

      expect(result).toBeUndefined();
    });

    it('parses a single ascending field', () => {
      const { sort } = parse('http://example.com?sort=name');
      const result = QueryHelper.parseSort(sort);

      expect(result).toEqual({
        name: 1,
      });
    });

    it('parses a single descending field', () => {
      const { sort } = parse('http://example.com?sort=-createdAt');
      const result = QueryHelper.parseSort(sort);

      expect(result).toEqual({
        createdAt: -1,
      });
    });

    it('parses multiple fields with mixed direction', () => {
      const { sort } = parse('http://example.com?sort=name,-createdAt,level');
      const result = QueryHelper.parseSort(sort);

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
        level: 1,
      });
    });

    it('handles extra whitespace around fields', () => {
      const { sort } = parse('http://example.com?sort= name , -createdAt ');
      const result = QueryHelper.parseSort(sort);

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
      });
    });
  });

  describe('sanitizeSort', () => {
    it('returns sort as-is when no allowed fields', () => {
      const { sort } = parse('http://example.com?sort=name,-createdAt');
      const result = QueryHelper.sanitizeSort(QueryHelper.parseSort(sort));

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
      });
    });

    it('strips fields not in the allowed list', () => {
      const { sort } = parse('http://example.com?sort=name,-createdAt,role');
      const result = QueryHelper.sanitizeSort(QueryHelper.parseSort(sort), ['name', 'createdAt']);

      expect(result).toEqual({
        name: 1,
        createdAt: -1,
      });
    });

    it('returns undefined when sort is undefined', () => {
      const result = QueryHelper.sanitizeSort(undefined, ['name']);

      expect(result).toBeUndefined();
    });

    it('returns empty object when no fields are allowed', () => {
      const { sort } = parse('http://example.com?sort=name,-createdAt');
      const result = QueryHelper.sanitizeSort(QueryHelper.parseSort(sort), ['email']);

      expect(result).toEqual({
        //
      });
    });
  });

  describe('sanitizeFilter', () => {
    it('returns the query as-is when no allowed fields are provided', () => {
      const { filter } = parse('http://example.com?filter[name]=john');

      const built = QueryHelper.parseFilter(filter);
      const result = QueryHelper.sanitizeFilter(built);

      expect(result).toEqual(built);
    });

    it('strips fields not in the allowed list', () => {
      const { filter } = parse(
        'http://example.com?filter[name][regex]=john&filter[role][ne]=admin',
      );

      const built = QueryHelper.parseFilter(filter);
      const result = QueryHelper.sanitizeFilter(built, ['name']);

      expect(result).toEqual({
        name: {
          $regex: 'john',
          $options: 'i',
        },
      });
    });

    it('allows only the specified fields', () => {
      const { filter } = parse(
        'http://example.com?filter[name][regex]=john&filter[age][gte]=18&filter[role][regex]=admin',
      );

      const built = QueryHelper.parseFilter(filter);
      const result = QueryHelper.sanitizeFilter(built, ['name', 'role']);

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
      const { filter } = parse('http://example.com?filter[name][regex]=john');
      const built = QueryHelper.parseFilter(filter);
      const result = QueryHelper.sanitizeFilter(built, ['email']);

      expect(result).toEqual({
        //
      });
    });
  });

  describe('nested fields', () => {
    it('parses a nested string field as a dot-notation regex', () => {
      const { filter } = parse('http://example.com?filter[address.city]=New York');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        'address.city': {
          $regex: 'New York',
          $options: 'i',
        },
      });
    });

    it('parses a nested field with an operator', () => {
      const { filter } = parse('http://example.com?filter[address.zip][gte]=10000');
      const result = QueryHelper.parseFilter(filter);

      expect(result).toEqual({
        'address.zip': {
          $gte: 10000,
        },
      });
    });

    it('sanitizeFilter keeps allowed nested fields', () => {
      const { filter } = parse(
        'http://example.com?filter[address.city]=New York&filter[status]=active',
      );

      const built = QueryHelper.parseFilter(filter);
      const result = QueryHelper.sanitizeFilter(built, ['address.city']);

      expect(result).toEqual({
        'address.city': {
          $regex: 'New York',
          $options: 'i',
        },
      });
    });

    it('sanitizeFilter strips nested fields not in the allowed list', () => {
      const { filter } = parse(
        'http://example.com?filter[address.city]=New York&filter[address.zip][gte]=10000',
      );

      const built = QueryHelper.parseFilter(filter);
      const result = QueryHelper.sanitizeFilter(built, ['address.zip']);

      expect(result).toEqual({
        'address.zip': {
          $gte: 10000,
        },
      });
    });
  });
});
