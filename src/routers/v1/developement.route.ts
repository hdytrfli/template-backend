import { Router, type Request } from 'express';

import { Hash } from '@/helpers/hash';
import { Company } from '@/models/company';
import { User } from '@/models/user';
import { pubsub } from '@/services/pubsub.service';
import { QueueService } from '@/services/queue.service';
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

  const upserts = users.map((user) => {
    return {
      updateOne: {
        filter: { username: user.username },
        update: { $setOnInsert: user },
        upsert: true,
      },
    };
  });

  await User.bulkWrite(upserts);
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
    companies.map((company) => ({
      updateOne: {
        filter: { name: company.name },
        update: { $setOnInsert: { ...company, createdBy: admin._id } },
        upsert: true,
      },
    })),
  );

  return res.json({
    success: true,
    message: 'Seed companies created successfully',
  });
});

router.get('/test/email', async (_req: Request, res: AppResponse<null>) => {
  const users = await User.find({ email: { $exists: true, $ne: '' } })
    .select('name email username')
    .lean();

  if (users.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No users with email found.',
    });
  }

  await QueueService.get('mail').add('send-bulk', {
    type: 'bulk',
    template: 'generic',
    subject: 'Hello from the platform!',
    body: 'This is a test email sent to all users.',
    recipients: users.map((user) => {
      return {
        name: user.name,
        email: user.email as string,
        vars: { username: user.username },
      };
    }),
  });

  return res.json({
    success: true,
    message: 'Queued email for all users with email',
  });
});

router.post('/notify', async (req: Request, res: AppResponse<null>) => {
  const { message } = req.body;

  await pubsub.publish('notifications', {
    text: message,
    timestamp: new Date().toISOString(),
  });

  return res.json({
    success: true,
    message: 'Published to notifications',
  });
});

export const developmentRouter = router;
