import pool from '../../lib/connect'

export default async function handler(req: any, res: any) {
  const [result] = await pool.query('SELECT userid from user order by userid desc limit 1')
  if (result.length > 0) {
    res.status(200).json({ luid: result[0].userid + 1 })
  }
  else {
    res.status(200).json({ luid: 1 })
  }
}
