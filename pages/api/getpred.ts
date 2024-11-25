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
    model: "gemini-1.5-flash",generationConfig: {
    temperature: 0.5,   
  }
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userid, job } = req.body;
    const query = 'SELECT Resume FROM profile WHERE userid = ?';
    const [rows]: any[] = await pool.query(query, [Number(userid)]);
    const skills = await pool.query('SELECT skillname,skill_level FROM skills WHERE user_id = ?', [Number(userid)]);
    if (rows.length > 0 && skills.length > 0) {
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
          

          const result = await model.generateContent([
            
            {
              
              fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
              },
              
            },
            
            {text:`You are a  Job recruiter taking hires for a the company ${job.company}. the details of the job are are: Job Title: ${job.title} Description: ${job.description} Required Skills: ${job.required_skills}  I have a student applying for the score whose skills along with his proficiency level are ${skills}. There is also his resume attached. Give a highly accurate and detailed report consisting of a success rate of getting accepted and compatability with the job,  an analysis on how he meets the requirements, what his strengths are with respect to the job post and areas for improvement. Make sure to check the resume for any skills/experiences that are not mentioned and professionally assess his chances of getting accepted. return these in a JSON object like { success_probability: (percentage value between 0.0 and 100.0) , analysis:[ { name: "",met:"1 for yes or 0 for no",explanation:''}], strengths:[sentences array] ,improvements: [sentences array], reccomendationsforhighmatch:[sentences array], otherjobsuggestions:[array]}. Ensure the the report you give is accurate and will not change  and it is a high level analysis. Ensure that the analysis, areas for improvement and your strengths to be concise and displayable as bullet points (maximum 80 characters per point). strictly restrict to the JSON format do not reply anything else and avoid using commas in the object values inorder to avoid JSON parse errors`}
          ]);
          const jsonString = result.response.text()
          .replace(/```json\n?/, '')  // Remove opening ```json and optional newline
          .replace(/\n?```\s*$/, '')  // Remove optional newline, closing ```, and any trailing whitespace
          .trim();                    // Remove any extra whitespace
          const response = JSON.parse(jsonString);
          console.log(response);
        res.status(200).json({response: response,status:200});
    }

}
