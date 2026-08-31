const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Use default system resolver if not supported
}
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const Candidate = require('./models/Candidate');
const Election = require('./models/Election');
const Vote = require('./models/Vote');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/college_voting');
    console.log('Database connected for seeding...');

    // Clear existing data
    await Student.deleteMany({});
    await Candidate.deleteMany({});
    await Election.deleteMany({});
    await Vote.deleteMany({});
    console.log('Existing collections cleared.');

    // 1. Create Admin Account
    const admin = await Student.create({
      name: 'System Election Administrator',
      email: 'admin@college.edu',
      password: 'admin123',
      department: 'Dean Office',
      year: 'Admin',
      rollNumber: 'ADMIN-001',
      role: 'admin'
    });
    console.log('Admin account created: admin@college.edu / admin123');

    // 2. Create Sample Students
    const student1 = await Student.create({
      name: 'Aarav Sharma',
      email: 'aarav@college.edu',
      password: 'student123',
      department: 'Computer Science',
      year: '3rd Year',
      rollNumber: 'CS2023-042',
      role: 'student'
    });

    const student2 = await Student.create({
      name: 'Ananya Roy',
      email: 'ananya@college.edu',
      password: 'student123',
      department: 'Electronics & Communication',
      year: '4th Year',
      rollNumber: 'EC2022-015',
      role: 'student'
    });

    const student3 = await Student.create({
      name: 'Rohan Verma',
      email: 'rohan@college.edu',
      password: 'student123',
      department: 'Mechanical Engineering',
      year: '2nd Year',
      rollNumber: 'ME2024-088',
      role: 'student'
    });

    console.log('3 Sample Students created.');

    // 3. Create Sample Elections
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 7);

    const pastStart = new Date();
    pastStart.setDate(now.getDate() - 5);
    const pastEnd = new Date();
    pastEnd.setDate(now.getDate() - 1);

    // Active Election
    const activeElection = await Election.create({
      title: 'Student Council President Election 2026',
      description: 'Vote for the Student Body President to represent student concerns to college management.',
      position: 'President',
      startDate: pastStart,
      endDate: futureDate,
      status: 'active'
    });

    // Concluded Election
    const concludedElection = await Election.create({
      title: 'Sports Committee Chair Election 2025',
      description: 'Annual election to select the chairperson of the College Sports & Athletics Council.',
      position: 'Sports Chair',
      startDate: pastStart,
      endDate: pastEnd,
      status: 'ended'
    });

    console.log('Sample Elections created (1 Active, 1 Concluded).');

    // 4. Create Candidates for Active Election
    const candidate1 = await Candidate.create({
      name: 'Priya Sundaram',
      department: 'Computer Science',
      year: '3rd Year',
      position: 'President',
      manifesto: 'Promoting transparent student governance, expanding campus Wi-Fi infrastructure, and organizing quarterly hackathons.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      electionId: activeElection._id
    });

    const candidate2 = await Candidate.create({
      name: 'Vikramaditya Singh',
      department: 'Mechanical Engineering',
      year: '4th Year',
      position: 'President',
      manifesto: 'Focusing on lab equipment upgrades, extended library hours during exam periods, and upgraded cafeteria menus.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      electionId: activeElection._id
    });

    // Candidates for Concluded Election
    const candidate3 = await Candidate.create({
      name: 'Kavya Patel',
      department: 'Civil Engineering',
      year: '3rd Year',
      position: 'Sports Chair',
      manifesto: 'Revamping college athletic facilities and hosting inter-college sports tournaments.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      electionId: concludedElection._id
    });

    const candidate4 = await Candidate.create({
      name: 'Siddharth Nair',
      department: 'Electronics & Communication',
      year: '4th Year',
      position: 'Sports Chair',
      manifesto: 'Establishing dedicated gym coaching sessions and funding for national varsity teams.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      electionId: concludedElection._id
    });

    console.log('Candidates created for elections.');

    // 5. Seed some votes in concluded election
    await Vote.create({
      studentId: student1._id,
      candidateId: candidate3._id,
      electionId: concludedElection._id,
      votedAt: new Date(now.getTime() - 86400000 * 2)
    });

    await Vote.create({
      studentId: student2._id,
      candidateId: candidate3._id,
      electionId: concludedElection._id,
      votedAt: new Date(now.getTime() - 86400000 * 2)
    });

    await Vote.create({
      studentId: student3._id,
      candidateId: candidate4._id,
      electionId: concludedElection._id,
      votedAt: new Date(now.getTime() - 86400000 * 3)
    });

    console.log('Sample votes seeded for concluded election.');
    console.log('\n--- SEEDING COMPLETE ---');
    console.log('Admin Credentials: admin@college.edu / admin123');
    console.log('Student Credentials: aarav@college.edu / student123');

    process.exit();
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
