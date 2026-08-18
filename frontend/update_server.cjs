const fs = require('fs');
const path = 'e:\\Echo-Portfolio\\ECHO-todo\\backend\\server.ts';

let code = fs.readFileSync(path, 'utf8');

// 1. Add POST /api/users
if (!code.includes('/api/users')) {
  const usersRoute = `
// Create User (For Postman)
app.post('/api/users', async (req, res) => {
  try {
    const data = { ...req.body };
    const user = await prisma.user.create({
      data
    });
    res.json(user);
  } catch (error) {
    console.error("User creation failed:", error);
    res.status(500).json({ error: 'Failed to create user', details: String(error) });
  }
});

`;
  code = code.replace('// Auth (Mock for Admin)', usersRoute + '// Auth (Mock for Admin)');
}

// 2. Improve error logging for POST /api/tasks
code = code.replace(
  `res.status(500).json({ error: 'Failed to create task' });`,
  `console.error("Task creation failed:", error);\n    res.status(500).json({ error: 'Failed to create task', details: String(error) });`
);

fs.writeFileSync(path, code);
console.log('Successfully updated server.ts');
