import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userid, jobid } = JSON.parse(req.body);
    console.log('delpred',userid,jobid);

    try{
        const [r1]:any = await pool.query('DELETE FROM predictions WHERE user_id = ? AND job_id = ?', [Number(userid), Number(jobid)]);
        return res.status(200).json({ response: r1, status: 200 });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error, status: 500 });
    } 
}