const fs = require('fs');
const path = 'backend/server.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'const tasks = await prisma.task.findMany({\n      orderBy: { createdAt: \'desc\' }\n    });',
  'const tasks = await prisma.task.findMany({\n      orderBy: { createdAt: \'desc\' },\n      include: { followUps: { orderBy: { createdAt: \'asc\' } } }\n    });'
);

const newEndpoint = "app.post('/api/tasks/:id/follow-ups', async (req, res) => {\n" +
"  try {\n" +
"    const { id } = req.params;\n" +
"    const { content } = req.body;\n" +
"    if (!content) return res.status(400).json({ error: 'Content is required' });\n" +
"    const followUp = await prisma.taskFollowUp.create({ data: { content, taskId: id } });\n" +
"    res.json(followUp);\n" +
"  } catch (error) {\n" +
"    res.status(500).json({ error: 'Failed' });\n" +
"  }\n" +
"});\n";

content = content.replace("app.put('/api/tasks/:id'", newEndpoint + "\napp.put('/api/tasks/:id'");

fs.writeFileSync(path, content);
console.log('server.ts updated');
