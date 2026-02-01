const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./src/models/User');
const Hall = require('./src/models/Hall');

const setupDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminExists = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@test.com',
        passwordHash: adminPassword,
        phone: '1234567890',
        role: 'ADMIN1'
      });
      console.log('✓ Admin user created (email: admin@test.com, password: admin123)');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Create test user
    const userPassword = await bcrypt.hash('user123', 10);
    const userExists = await User.findOne({ email: 'user@test.com' });
    
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        passwordHash: userPassword,
        phone: '0987654321',
        role: 'USER'
      });
      console.log('✓ Test user created (email: user@test.com, password: user123)');
    } else {
      console.log('✓ Test user already exists');
    }

    // Create halls
    const hallCount = await Hall.countDocuments();
    
    if (hallCount === 0) {
      await Hall.insertMany([
        {
          name: 'Grand Ballroom',
          capacity: 500,
          amenities: ['Stage', 'Sound System', 'AC', 'Projector', 'LED Screens'],
          description: 'Our flagship venue featuring a stunning ballroom perfect for large weddings, corporate events, and galas. The Grand Ballroom boasts elegant chandeliers, a spacious dance floor, and state-of-the-art audio-visual equipment.',
          pricePerHour: 15000,
          panoramaUrl: 'https://picsum.photos/2000/800?random=1',
          images: [
            'https://picsum.photos/500/400?random=11',
            'https://picsum.photos/500/400?random=12',
            'https://picsum.photos/500/400?random=13'
          ],
          isActive: true
        },
        {
          name: 'Crystal Hall',
          capacity: 200,
          amenities: ['AC', 'Tables', 'Chairs', 'Podium'],
          description: 'An intimate and elegant space with crystal accents and soft lighting. Perfect for medium-sized gatherings, cocktail parties, and corporate meetings.',
          pricePerHour: 8000,
          panoramaUrl: 'https://picsum.photos/2000/800?random=2',
          images: [
            'https://picsum.photos/500/400?random=21',
            'https://picsum.photos/500/400?random=22'
          ],
          isActive: true
        },
        {
          name: 'Garden Venue',
          capacity: 300,
          amenities: ['Open Air', 'Lighting', 'Parking', 'Catering Area'],
          description: 'A beautiful outdoor venue surrounded by lush greenery. Ideal for garden weddings, summer parties, and outdoor celebrations under the stars.',
          pricePerHour: 12000,
          panoramaUrl: 'https://picsum.photos/2000/800?random=3',
          images: [
            'https://picsum.photos/500/400?random=31',
            'https://picsum.photos/500/400?random=32'
          ],
          isActive: true
        },
        {
          name: 'Conference Room A',
          capacity: 100,
          amenities: ['AC', 'Projector', 'Whiteboard', 'WiFi'],
          description: 'A professional conference space equipped with modern technology. Perfect for business meetings, seminars, and training sessions.',
          pricePerHour: 5000,
          panoramaUrl: 'https://picsum.photos/2000/800?random=4',
          images: [
            'https://picsum.photos/500/400?random=41',
            'https://picsum.photos/500/400?random=42'
          ],
          isActive: true
        },
        {
          name: 'Rooftop Lounge',
          capacity: 150,
          amenities: ['Open Air', 'Bar', 'Lounge Seating', 'City View'],
          description: 'A sophisticated rooftop venue with breathtaking city views. Perfect for cocktail parties, networking events, and exclusive gatherings.',
          pricePerHour: 10000,
          panoramaUrl: 'https://picsum.photos/2000/800?random=5',
          images: [
            'https://picsum.photos/500/400?random=51',
            'https://picsum.photos/500/400?random=52'
          ],
          isActive: true
        }
      ]);
      console.log('✓ Sample halls created');
    } else {
      console.log(`✓ ${hallCount} halls already exist`);
    }

    console.log('\n=== Database Setup Complete ===');
    console.log('\nLogin Credentials:');
    console.log('Admin: admin@test.com / admin123');
    console.log('User:  user@test.com / user123');
    console.log('\nYou can now start the backend server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
