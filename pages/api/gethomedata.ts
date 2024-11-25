import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userid = req.body.userid;
    console.log('userid:',userid);
    const query = 'SELECT  p.*, (SELECT COUNT(*) FROM SKILLS s WHERE s.user_id = p.userid) as skill_count FROM PROFILE p WHERE p.userid = ?  ';
    const q2 = 'SELECT skill_id,skillname,skill_level FROM SKILLS WHERE user_id = ?';
    const q3 = 'SELECT * FROM JOBS';
    const q4 = 'SELECT AVG(success_probability) as avg_success FROM predictions WHERE user_id = ?';
    const [rows]: any[] = await pool.query(query, [Number(userid)]);
    const [rows2]: any[] = await pool.query(q2, [Number(userid)]);
    const [rows3]: any[] = await pool.query(q3);
    const [rows4]: any[] = await pool.query(q4, [Number(userid)]);
    console.log('avg_success: ',rows4[0].avg_success);
    if (rows.length > 0) {
    res.status(200).json({res:rows,skills:rows2,jobs:rows3,avg_success:rows4[0].avg_success});
    } else {
        res.status(404).json({message:'Error Not Found '})
    }
}   