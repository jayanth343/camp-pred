import pool from '../../lib/connect';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { userid } = JSON.parse(req.body);
    try {   
      const [rows]:any = await pool.query('SELECT * FROM profile WHERE userid = ?', [userid]);
      console.log(rows[0])
      if (rows.length > 0) {
        res.status(200).json({ profile: rows[0] });
      } else {
        res.status(404).json({ message: 'Profile not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error });
    }
  } 
}