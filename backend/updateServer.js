const fs = require('fs');
const path = 'backend/server.ts';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  "const { content } = req.body;",
  "const { content, reminderTime } = req.body;"
);
content = content.replace(
  "const followUp = await prisma.taskFollowUp.create({ data: { content, taskId: id } });",
  "const followUp = await prisma.taskFollowUp.create({ data: { content, taskId: id, reminderTime: reminderTime ? new Date(reminderTime) : null } });"
);
fs.writeFileSync(path, content);
console.log('server.ts updated with reminderTime');
