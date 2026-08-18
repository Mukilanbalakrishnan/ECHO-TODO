const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { target, replacement } of replacements) {
    content = content.replace(target, replacement);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceInFile('src/components/common/Badge.tsx', [
  { target: "import { Priority, Status } from '../../types';", replacement: "import type { Priority, Status } from '../../types';" }
]);

replaceInFile('src/components/layout/Header.tsx', [
  { target: "import { User } from '../../types';", replacement: "import type { User } from '../../types';" }
]);

replaceInFile('src/components/tasks/TaskCard.tsx', [
  { target: "import { Task } from '../../types';", replacement: "import type { Task } from '../../types';" }
]);

replaceInFile('src/components/tasks/TaskDetails.tsx', [
  { target: "import { Task } from '../../types';", replacement: "import type { Task } from '../../types';" }
]);

replaceInFile('src/components/tasks/TaskList.tsx', [
  { target: "import { Task } from '../../types';", replacement: "import type { Task } from '../../types';" }
]);

replaceInFile('src/components/tasks/TaskModal.tsx', [
  { target: "import { Priority, Status, Task } from '../../types';", replacement: "import type { Priority, Status, Task } from '../../types';" }
]);

replaceInFile('src/components/tasks/TaskStats.tsx', [
  { target: "import { Task } from '../../types';", replacement: "import type { Task } from '../../types';" }
]);

replaceInFile('src/contexts/ToastContext.tsx', [
  { target: "import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';", replacement: "import React, { createContext, useContext, useState, useCallback } from 'react';\nimport type { ReactNode } from 'react';" }
]);

replaceInFile('src/data/mockTasks.ts', [
  { target: "import { Task } from '../types';", replacement: "import type { Task } from '../types';" }
]);

replaceInFile('src/hooks/useAuth.ts', [
  { target: "import { User } from '../types';", replacement: "import type { User } from '../types';" }
]);

replaceInFile('src/hooks/useTasks.ts', [
  { target: "import { Task } from '../types';", replacement: "import type { Task } from '../types';" }
]);

replaceInFile('src/pages/Completed.tsx', [
  { target: "import { Task, FilterState } from '../components/tasks/TaskFilters';", replacement: "import type { FilterState } from '../components/tasks/TaskFilters';\nimport type { Task } from '../types';" }
]);

replaceInFile('src/pages/Todo.tsx', [
  { target: "import { Task, FilterState } from '../components/tasks/TaskFilters';", replacement: "import type { FilterState } from '../components/tasks/TaskFilters';\nimport type { Task } from '../types';" }
]);

replaceInFile('src/pages/Settings.tsx', [
  { target: "import { Settings as SettingsIcon, User, Bell, Palette, Shield } from 'lucide-react';", replacement: "import { User, Bell, Palette, Shield } from 'lucide-react';" }
]);

console.log("Fixes applied!");
