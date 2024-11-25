import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {userid} = JSON.parse(req.body);
    console.log('userid:',userid);
    const query = 'SELECT * FROM SKILLS WHERE user_id = ?';
    const [rows]: any[] = await pool.query(query, [Number(userid)]);
    if (rows.length > 0) {
        res.status(200).json({skills:rows});
    } else {
        res.status(404).json({message:'Error No Skills Found '})
    }
}