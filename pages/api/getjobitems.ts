import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const query = 'SELECT  job_id FROM jobs ORDER BY job_id';

    const [rows]: any[] = await pool.query(query);
    const joblist = rows.map((row: any) => row.job_id);
    if (rows.length === 0) {
        res.status(404).json({ message: "No jobs found" ,status:404});
    } else {
        res.status(200).json({ joblist: joblist ,status:200});
    }
}