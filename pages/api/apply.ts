import { NextApiRequest, NextApiResponse } from "next";
import pool from '@/lib/connect'


export const config = {
    api: {
      bodyParser: {
        sizeLimit: '100mb' // Set a larger limit if necessary
      }
    }
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const data  = JSON.parse(req.body);
        console.log("COVER LETTER:: ", data?.coverLetter);
        //console.log("RESUME FILE:: ", data?.profile?.Resume);
        console.log("PROFILE:: ", data?.profile);
        console.log("SKILLS:: ", data?.skills);
    }
    res.status(200).json({ message: "Application submitted successfully" ,status:200});
}