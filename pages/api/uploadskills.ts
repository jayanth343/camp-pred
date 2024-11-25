import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const skills = req.body.skills;             
    const userid = req.body['userid'];
    console.log(userid);
    const query = 'INSERT INTO skills (skill_id,user_id, skillname, skill_level) VALUES (?, ?, ?, ?)';
    try{
    skills.forEach(async (skill:any,index:number) => {
        console.log(index+1,skill);
        const [rows]: any[] = await pool.query(query, [index+1, userid, skill.name, skill.level]);
        });
    res.status(200).json({ message: 'Skills uploaded successfully' });
} catch (error) {
    console.error('Error uploading skills:', error);
    res.status(500).json({ message: 'Error uploading skills' });
}
}
