import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const query = 'SELECT * FROM jobs';
    const [rows]: any[] = await pool.query(query);
    if (rows.length > 0) {
        res.status(200).json({jobs: rows,status:200});
    } else {
        res.status(404).json({ message: 'No jobs found',status:404});
    }
}
