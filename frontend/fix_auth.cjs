const fs = require('fs');
const path = 'e:\\Echo-Portfolio\\ECHO-todo\\backend\\server.ts';

let code = fs.readFileSync(path, 'utf8');

const oldUpsert = `    // Upsert user in DB so foreign keys work
    const user = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        id: 'usr_1',
        username: 'admin',
        name: 'Admin User',
        password: 'admin123'
      }
    });
    res.json({ user });`;

const newAuth = `    let user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      // Create user if not exists but let DB generate UUID to avoid collisions
      user = await prisma.user.create({
        data: { username, password, name: 'Admin User' }
      });
    }
    res.json({ user });`;

if (code.includes('prisma.user.upsert')) {
  code = code.replace(oldUpsert, newAuth);
  fs.writeFileSync(path, code);
  console.log('Fixed login upsert error');
} else {
  console.log('Could not find upsert block to replace. Here is the code:', code.substring(0, 1000));
}
