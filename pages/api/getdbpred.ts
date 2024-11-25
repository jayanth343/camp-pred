import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userid, jobid } = JSON.parse(req.body);
    console.log('getdbpred',userid,jobid);

    try{
        const [r1]:any = await pool.query('SELECT * FROM predictions WHERE user_id = ? AND job_id = ?', [Number(userid), Number(jobid)]);
        console.log(r1);
        if(r1.length > 0 && r1[0]?.success_probability !== null ){
            return res.status(200).json({ response: r1[0], status: 200 });
        }
        else{
            return res.status(200).json({ response: null, status: 404});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error, status: 500 });
    } 
}