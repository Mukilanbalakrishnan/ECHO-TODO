import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());


// Create User (For Postman)
app.post('/api/users', async (req, res) => {
  try {
    const data = { ...req.body };
    // Hash password
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const user = await prisma.user.create({
      data
    });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({ error: 'Failed to create user', details: String(error) });
  }
});

// Auth (Mock for Admin)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await prisma.user.findUnique({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please create an account first.' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Tasks CRUD
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      include: { followUps: { orderBy: { createdAt: 'asc' } } }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.userId) {
      // Find the first available user in DB to attach to this task (to avoid FK constraint failures)
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) throw new Error("No users exist in DB");
      data.userId = firstUser.id;
    }
    
    const task = await prisma.task.create({
      data
    });
    res.json(task);
  } catch (error) {
    console.error("Task creation failed:", error);
    res.status(500).json({ error: 'Failed to create task', details: String(error) });
  }
});

app.post('/api/tasks/:id/follow-ups', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, reminderTime } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    const followUp = await prisma.taskFollowUp.create({ data: { content, taskId: id, reminderTime: reminderTime ? new Date(reminderTime) : null } });
    res.json(followUp);
  } catch (error) {
    res.status(500).json({ error: 'Failed' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.userId;
    
    const task = await prisma.task.update({
      where: { id },
      data
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Offer Letters CRUD
app.get('/api/offer-letters', async (req, res) => {
  try {
    const offerLetters = await prisma.offerLetter.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(offerLetters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offer letters' });
  }
});

app.post('/api/offer-letters', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.userId) {
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) throw new Error("No users exist in DB");
      data.userId = firstUser.id;
    }
    
    const offerLetter = await prisma.offerLetter.create({
      data
    });
    res.json(offerLetter);
  } catch (error) {
    console.error("Offer Letter creation failed:", error);
    res.status(500).json({ error: 'Failed to create offer letter', details: String(error) });
  }
});

app.put('/api/offer-letters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.userId;
    
    const offerLetter = await prisma.offerLetter.update({
      where: { id },
      data
    });
    res.json(offerLetter);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offer letter' });
  }
});

app.delete('/api/offer-letters/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.offerLetter.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete offer letter' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
