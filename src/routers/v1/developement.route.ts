import { Router, type Request } from 'express';

import { Hash } from '@/helpers/hash';
import { Company } from '@/models/company';
import { User } from '@/models/user';
import type { AppResponse } from '@/types/response';

const router: Router = Router();

router.get('/seed/users', async (_req: Request, res: AppResponse<null>) => {
  const users = [
    {
      username: 'admin',
      name: 'Admin User',
      password: Hash.hash('password'),
      level: 'admin',
      email: 'admin@example.com',
    },
    {
      username: 'user',
      name: 'Regular User',
      password: Hash.hash('password'),
      level: 'user',
      email: 'user@example.com',
    },
  ];

  await User.bulkWrite(
    users.map((user) => ({
      updateOne: {
        filter: { username: user.username },
        update: { $setOnInsert: user },
        upsert: true,
      },
    })),
  );

  return res.json({
    success: true,
    message: 'Seed users created successfully',
  });
});

router.get('/seed/companies', async (_req: Request, res: AppResponse<null>) => {
  const admin = await User.findOne({ level: 'admin' }).lean();

  if (!admin) {
    return res.status(400).json({
      success: false,
      message: 'Admin user not found. Run /seed/users first.',
    });
  }

  const companies = [
    {
      name: 'Acme Technologies',
      country: 'Indonesia',
      email: 'contact@acme-tech.co.id',
      companyType: 'Software Development',
    },
    {
      name: 'Nusantara Digital',
      country: 'Indonesia',
      email: 'hello@nusantara-digital.com',
      companyType: 'Consulting',
    },
    {
      name: 'Regional Ventures Pte Ltd',
      country: 'Singapore',
      email: 'info@regionalventures.sg',
      companyType: 'Finance',
    },
  ];

  await Company.bulkWrite(
    companies.map((c) => ({
      updateOne: {
        filter: { name: c.name },
        update: { $setOnInsert: { ...c, createdBy: admin._id } },
        upsert: true,
      },
    })),
  );

  return res.json({
    success: true,
    message: 'Seed companies created successfully',
  });
});

export default router;
