import { NextApiRequest, NextApiResponse } from 'next'
import { isEmptyObject } from 'src/utils'
import { verifyJWT } from 'src/utils/jwt'

import createProject from './sql/createProject.sql'
import getProjects from './sql/getProjects.sql'
import { pool } from '..'

const count = 12

export default async function handleProjects(req: NextApiRequest, res: NextApiResponse) {
  // Get project
  if (req.method === 'GET') {
    const { page } = req.query
    if (!page) return res.status(400).send('Please check your inputs of request')

    try {
      const [rows] = await pool.query(getProjects, [+page * count + 1, count]) // 첫번째 프로젝트 = 현재 프로젝트
      return res.status(200).json(rows)
    } catch (error) {
      return res.status(500).send('500: Database query error')
    }
  }

  // Create project
  if (req.method === 'POST') {
    const jwt = req.headers.authorization
    if (!jwt) return res.status(401).send('Need to authenticate')

    const verifiedJwt = await verifyJWT(jwt).catch(() => null)
    if (!verifiedJwt) return res.status(400).send('Invalid JWT')
    if (!verifiedJwt.isAdmin) return res.status(403).send('Require administrator privileges')

    const { title, description } = req.body
    if (!title || !description) return res.status(400).send('Please check your inputs of request')

    const [rows] = await pool.query(createProject, [title, description])
    return res.status(200).json({ rows })
  }

  // Else
  return res.status(405).send('Method not allowed')
}
