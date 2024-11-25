import pool from '../../lib/connect';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { editSkills, delSkills,addSkills,userid } = JSON.parse(req.body);
    console.log(editSkills);
    console.log(delSkills);
    console.log(addSkills);
    try{
    editSkills.forEach(async (skill:any) => {
        const query = 'UPDATE SKILLS SET skillname = ?, skill_level = ? WHERE skill_id = ? AND user_id = ?';
        await pool.query(query, [skill.skillname, skill.skill_level,Number(skill.skill_id),Number(userid)]);
    });
    delSkills.forEach(async (skill:any) => {
        const query = 'DELETE FROM SKILLS WHERE skill_id = ? AND user_id = ?';
        await pool.query(query, [Number(skill.skill_id),Number(userid)]);
    });
    addSkills.forEach(async (skill:any) => {
        const query = 'INSERT INTO SKILLS (user_id, skill_id, skillname, skill_level) VALUES (?, ?, ?, ?)';
        await pool.query(query, [Number(userid), Number(skill.skill_id), skill.skillname, skill.skill_level]);
    });
    res.status(200).json({message:'Skills updated Successfully',status:200});
    }catch(error){
        res.status(500).json({message:'Error updating skills',status:500});
    }
}

