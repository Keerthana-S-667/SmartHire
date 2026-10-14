/**
 * SmartHire Admin Seeding Script
 * Safely creates an initial Administrator account from environment variables.
 *
 * Security Note:
 * Admin accounts cannot be created through the public registration API.
 * This script runs locally or in CI/CD environments with server privileges.
 *
 * Usage:
 *   cd server
 *   npm run seed:admin
 */

const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const { User } = require('../models/User');

const seedAdmin = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smarthire';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  console.log('--- SmartHire Admin Account Provisioning ---');

  if (!adminEmail || !adminPassword) {
    console.error('\n[Error] Missing admin credentials in environment variables.');
    console.error('Please configure ADMIN_EMAIL and ADMIN_PASSWORD in your server/.env file.');
    console.error('Example:');
    console.error('  ADMIN_EMAIL=admin@smarthire.local');
    console.error('  ADMIN_PASSWORD=Admin@12345\n');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully.');

    const normalizedEmail = adminEmail.toLowerCase().trim();

    // Check if an account with this email already exists
    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      if (existing.role === 'admin') {
        console.log(`[Info] Admin account with email "${normalizedEmail}" already exists. No action needed.`);
      } else {
        console.warn(`[Warning] An account with email "${normalizedEmail}" exists with role "${existing.role}".`);
        console.warn('Updating role to "admin"...');
        existing.role = 'admin';
        await existing.save();
        console.log('User upgraded to admin successfully.');
      }
    } else {
      console.log(`Creating new Administrator account: ${normalizedEmail}`);
      const passwordHash = await User.hashPassword(adminPassword);

      await User.create({
        name: adminName.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'admin',
      });

      console.log('\n============================================================');
      console.log('Administrator account created successfully!');
      console.log(`Name:  ${adminName}`);
      console.log(`Email: ${normalizedEmail}`);
      console.log('Role:  admin');
      console.log('============================================================\n');
    }

    await mongoose.disconnect();
    console.log('Database connection closed. Seed completed.');
    process.exit(0);
  } catch (error) {
    console.error('\n[Seed Failed] Could not create admin account.');
    console.error(`Error: ${error.message}`);
    console.error('Tip: Ensure MongoDB server is running and accessible.');
    process.exit(1);
  }
};

seedAdmin();
