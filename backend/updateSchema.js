const fs = require('fs');
const path = 'backend/prisma/schema.prisma';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  '  content   String',
  '  content   String\n  reminderTime DateTime?'
);
fs.writeFileSync(path, content);
console.log('schema.prisma updated with reminderTime');
