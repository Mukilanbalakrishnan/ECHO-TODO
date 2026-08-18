const fs = require('fs');
const path = 'e:\\Echo-Portfolio\\ECHO-todo\\backend\\server.ts';

let code = fs.readFileSync(path, 'utf8');

const oldTaskCreate = `    const data = { ...req.body };
    if (!data.userId) data.userId = 'usr_1';
    
    const task = await prisma.task.create({`;

const newTaskCreate = `    const data = { ...req.body };
    if (!data.userId) {
      // Find the first available user in DB to attach to this task (to avoid FK constraint failures)
      const firstUser = await prisma.user.findFirst();
      if (!firstUser) throw new Error("No users exist in DB");
      data.userId = firstUser.id;
    }
    
    const task = await prisma.task.create({`;

code = code.replace(oldTaskCreate, newTaskCreate);
fs.writeFileSync(path, code);
console.log('Fixed task creation userId fallback');
