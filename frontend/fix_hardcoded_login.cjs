const fs = require('fs');
const path = 'e:\\Echo-Portfolio\\ECHO-todo\\backend\\server.ts';

let code = fs.readFileSync(path, 'utf8');

// The exact string to replace is the entire login block. Let's just find the login block and rewrite it cleanly.
const authStart = `// Auth (Mock for Admin)
app.post('/api/auth/login', async (req, res) => {`;

const authEndString = `  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});`;

// Wait, the safest way is to use regex to replace the entire app.post('/api/auth/login', ...) route.
const routeRegex = /app\.post\('\/api\/auth\/login', async \(req, res\) => \{[\s\S]*?\}\);/;

const newLoginRoute = `app.post('/api/auth/login', async (req, res) => {
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
});`;

if (routeRegex.test(code)) {
  code = code.replace(routeRegex, newLoginRoute);
  fs.writeFileSync(path, code);
  console.log('Successfully fixed hardcoded login route');
} else {
  console.log('Could not find login route with regex.');
}
