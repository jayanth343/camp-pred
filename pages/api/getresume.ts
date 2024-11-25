import { NextApiResponse } from 'next';
import { NextApiRequest } from 'next';
import pool from '../../lib/connect';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const userid = req.body;
    const query = 'SELECT Resume FROM profile WHERE userid = ?';
    const [rows]: any[] = await pool.query(query, [Number(userid)]);
    if ( rows.length > 0) {
        const tempFile = new File([rows[0].Resume], "temp_resume.pdf", {
            type: "application/pdf",
          });
          const fileBuffer = await tempFile.arrayBuffer();
          const buffer = Buffer.from(fileBuffer);
          const uint8Array = new Uint8Array(buffer);

          const tempFilePath = join(tmpdir(), 'temp_resume.pdf');
          writeFileSync(tempFilePath, buffer);

          const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: "application/pdf",
            displayName: "Resume",
          });
          console.log(
            `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
          );
          const result = await model.generateContent([
            {
              fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
              },
            },
            { text: `Please analyze this resume and extract all technical skills and professional competencies. For each skill, assess the proficiency level (Beginner, Intermediate, Advanced, Expert) based on the context, experience, and projects mentioned. Ensure that the skills are not duplicates and is professionally valid for a recruiter seeking applicants for a job. Return the results in JSON format like this:    {      "skills": [        {          "name": "skill name",          "level": "level",          "context": "brief explanation of assessment"        }      ]    }` },
          ]);
          const jsonString = result.response.text()
          .replace(/```json\n/, '')  // Remove opening ```json
          .replace(/\n```$/, '')     // Remove closing ```
          .trim();                   // Remove any extra whitespace
      
          const skills = JSON.parse(jsonString);
          console.log(skills);
        res.status(200).json({skills: skills});
    } else {
        res.status(404).json({error: 'Resume not found'});
    }
}