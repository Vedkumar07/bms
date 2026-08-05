import express from 'express';
import { client } from '@repo/db/client';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'http-server is running' });
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    res.status(400).json({
      error: 'username and password are required',
    });
    return;
  }

  try {
    const user = await client.user.create({
      data: {
        username,
        password,
      },
    });

    res.status(201).json({
      message: 'signup successful',
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(409).json({
      error: 'username already exists',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});