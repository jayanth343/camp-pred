import pool from '../../lib/connect';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { userid } = JSON.parse(req.body);
    try {   
      const [rows]:any = await pool.query("SELECT p.*, s.skillname, s.skill_level FROM profile p LEFT JOIN skills s ON p.userid = s.user_id WHERE p.userid = ?;", [userid]);
      console.log(rows[0])
      let skills:any[] = []
      rows.forEach((row:any) => {
        skills.push({skillname:row.skillname,skill_level:row.skill_level});
      })
      if (rows.length > 0) {
        res.status(200).json({ profile: rows[0], skills: skills });
      } else {
        res.status(404).json({ message: 'Profile, Skills not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching profile', error: error });
    }
  } 
}