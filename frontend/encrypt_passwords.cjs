const fs = require('fs');
const path = 'e:\\Echo-Portfolio\\ECHO-todo\\backend\\server.ts';

let code = fs.readFileSync(path, 'utf8');

if (!code.includes("import bcrypt from 'bcryptjs'")) {
  code = code.replace(
    "import express from 'express';",
    "import express from 'express';\nimport bcrypt from 'bcryptjs';"
  );
}

// Fix /api/auth/login
const oldAuth = `    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      // Create user if not exists but let DB generate UUID to avoid collisions
      user = await prisma.user.create({
        data: { username, password, name: 'Admin User' }
      });
    }
    res.json({ user });`;

const newAuth = `    let user = await prisma.user.findUnique({ where: { username } });
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
    res.json({ user: userWithoutPassword });`;

if (code.includes('await prisma.user.findUnique')) {
  code = code.replace(oldAuth, newAuth);
}

// Fix /api/users
const oldUsers = `    const user = await prisma.user.create({
      data
    });
    res.json(user);`;

const newUsers = `    // Hash password
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }
    const user = await prisma.user.create({
      data
    });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);`;

if (code.includes('const user = await prisma.user.create({\n      data\n    });')) {
  code = code.replace(oldUsers, newUsers);
}

fs.writeFileSync(path, code);
console.log('Successfully updated server.ts with bcrypt');
