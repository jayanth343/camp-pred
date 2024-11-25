import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import pool from '../../lib/connect';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userid, jobid, pred } = JSON.parse(req.body);
    console.log('uppred');
    try {
        const [r1]:any = await pool.query('SELECT * FROM predictions WHERE user_id = ? AND job_id = ?', [userid, jobid]);
        console.log(r1.length);
        const strengthsString = pred?.strengths ? JSON.stringify(pred.strengths).replace(/"/g, '') : '';
        console.log(strengthsString);
        const improvementsString = pred?.improvements ? JSON.stringify(pred.improvements).replace(/"/g, '') : '';
        const requirementsString = pred?.analysis? JSON.stringify(pred?.analysis).replace(/"/g, '') : '';
        console.log(requirementsString);
        const otherjobsString = pred?.otherjobsuggestions ? JSON.stringify(pred.otherjobsuggestions).replace(/"/g, '') : '';

        if(r1?.length > 0){
            const [r2]:any = await pool.query('UPDATE predictions SET success_probability = ? WHERE user_id = ? AND job_id = ?', [pred?.success_probability,userid, jobid]);
            const [r3]:any = await pool.query('UPDATE predictions SET strengths = ? WHERE user_id = ? AND job_id = ?', [strengthsString,userid, jobid]);
            const [r4]:any = await pool.query('UPDATE predictions SET improvements = ? WHERE user_id = ? AND job_id = ?', [improvementsString,userid, jobid]);
            const [r5]:any = await pool.query('UPDATE predictions SET analysis = ? WHERE user_id = ? AND job_id = ?', [requirementsString,userid, jobid]);
            const [r6]:any = await pool.query('UPDATE predictions SET otherjobsuggestions = ? WHERE user_id = ? AND job_id = ?', [otherjobsString,userid, jobid]);
            const [r7]:any = await pool.query('UPDATE predictions SET gen_at = ? WHERE user_id = ? AND job_id = ?', [new Date(Date.now()).toISOString(),userid, jobid]);
            return res.status(200).json({ message: "Updated in Table!" ,status:200});

        }
        else{
            console.log('Inserting in Table!');
            const [r2]:any = await pool.query('INSERT INTO predictions (user_id, job_id, success_probability, strengths, improvements,analysis,otherjobsuggestions) VALUES (?, ?, ?, ?, ?, ?, ?)', [userid, jobid, pred?.success_probability, strengthsString, improvementsString, requirementsString, otherjobsString ]);
            return res.status(200).json({ message: "Inserted in Table!" ,status:200});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error,status:500})
    }

}

//[{name:Python,met:1,explanation:Proficient in Python, demonstrated by projects.},{name:Machine Learning,met:0,explanation:Resume mentions interest but lacks concrete ML experience.},{name:SQL,met:0,explanation:No mention of SQL skills in resume or projects.},{name:R,met:0,explanation:No mention of R programming language skills.}]