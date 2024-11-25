import pool from '../../lib/connect';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const { luid, name, email, username, password } = JSON.parse(req.body);
      
      const parsedLuid = parseInt(luid, 10);
      if (isNaN(parsedLuid)) {
        return res.status(400).json({ 
          message: 'Invalid LUID provided', 
          error: 'LUID must be a valid number' 
        });
      }

      console.log('Received values:', { 
        luid: parsedLuid, 
        name, 
        email, 
        username 
      }); 

      const [result] = await pool.query(
        'INSERT INTO USER (userid, Name, Email, Username, Type, Password) VALUES (?, ?, ?, ?, ?, ?)',
        [parsedLuid, name, email, username, 'User', password]
      );

      res.status(201).json({ 
        message: 'User registered successfully', 
        userId: parsedLuid,
        status: 200
      });
    } catch (error:any) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Error registering user', 
        error: error.message,
        status: 500
      });
    }
  } else {
    res.status(405).json({ 
      message: 'Method not allowed',
      status: 405
    });
  }
}