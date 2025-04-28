import User from '../models/User';
import bcrypt from 'bcryptjs';

const createDefaultAdmin = async () => {
  const defaultEmail = 'admin@naturopura.com';
  const defaultPassword = 'Admin@123';

  const existingAdmin = await User.findOne({ email: defaultEmail });
  if (existingAdmin) return;

  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  await User.create({
    name: 'Tusar Mohapatra',
    email: defaultEmail,
    password: hashedPassword,
    role: 'admin',
    isDefaultAdmin: true
  });

  console.log('✅ Default admin created');
};

export default createDefaultAdmin;
