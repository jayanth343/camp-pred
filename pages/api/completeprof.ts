import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import pool from '../../lib/connect';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const form = formidable();

    const [fields, files] = await new Promise<[any, any]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const { userid, phone, dob, education, fullName, email } = fields;
    const resume = files.resume;
    console.log('Received data:', {
      userid,
      fullName,
      email,
      phone,
      dob,
      education: JSON.parse(education as string),
      resume,
    });
    const resumeBlob = await new Promise((resolve, reject) => {
        fs.readFile(resume[0].filepath, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });  
    const [query_result] = await pool.query(`CALL complete_profile(?, ?, ?);`, [parseInt(userid[0],10) , phone[0], dob]);
    const [query_result2] = await pool.query('UPDATE profile SET Resume = ? WHERE UserID = ?', [resumeBlob, parseInt(userid[0],10)]);
    education.forEach(async (edu: any) => {
      const [query_result3] = await pool.query('INSERT INTO education (userid, institute, major, FieldOfStudy, StartDate, EndDate) VALUES (?, ?, ?, ?, ?, ?)', [parseInt(userid[0],10), edu.school, edu.degree, edu.fieldOfStudy, edu.startDate, edu.endDate]);
    });
     res.status(200).json({ message: 'Profile completed successfully', status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Error updating profile', status: 500 });
  }
}
