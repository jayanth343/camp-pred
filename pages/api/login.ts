import bcrypt from 'bcrypt';
import base64 from 'base-64';
import pool from '../../lib/connect';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(req.body)
      const username = body.username;
      const password = body.password;

      console.log('Username:', username);
      console.log('Password:', password);

      const [rows] = await pool.query(
        'SELECT * FROM USER WHERE Username = ?',
        [username]
      );

      console.log('Query Result:', rows);
      console.log(base64.decode(rows[0].Password) )
      if (rows.length > 0) {
        const user = rows[0];
        const isMatch = rows[0].Password === password;
        console.log('Password Match:', isMatch);

        if (isMatch) {
          res.status(200).json({ message: 'Login successful', user: user,code:200 });
        } else {
          res.status(401).json({ message: 'Invalid credentials',code:401 });
        }
      } else {
        res.status(401).json({ message: 'Invalid credentials',code:401 });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error: error,code:500 });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed',code:405 });
  }
}