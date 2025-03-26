import { db } from '../server/storage';
import { hash } from 'bcrypt';
import { users } from '../shared/schema';

async function createSuperusers() {
  const superusers = [
    {
      username: 'lawrence_otieno',
      displayName: 'Lawrence Otieno',
      email: 'cybertechocean@gmail.com',
      password: 'L@HhZ5LGZYkr1d.KtzFxXUmP',
      role: 'admin'
    },
    {
      username: 'collins_otieno',
      displayName: 'Collins Otieno', 
      email: 'collinsokoth71@gmail.com',
      password: 'Col!Rtpz7L@HKt3Ts',
      role: 'admin'
    }
  ];

  for (const user of superusers) {
    const hashedPassword = await hash(user.password, 10);
    await db.insert(users).values({
      ...user,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
  }

  console.log('Superusers created successfully');
}

createSuperusers().catch(console.error);