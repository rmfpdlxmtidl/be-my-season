import { NextApiRequest, NextApiResponse } from 'next'
import { encodeSex } from 'src/utils'
import { generateJWT } from 'src/utils/jwt'

import { pool } from '../..'
import getKakaoUser from './sql/getKakaoUser.sql'
import registerKakaoUser from './sql/registerKakaoUser.sql'

export default async function handleKakaoAuth(req: NextApiRequest, res: NextApiResponse) {
  if (!req.query.code) {
    return res.status(400).send('400 Bad Request')
  }

  const kakaoUserToken = await fetchKakaoUserToken(req.query.code as string)
  if (kakaoUserToken.error) {
    return res.status(400).send('400 Bad Request')
  }

  const kakaoUserInfo = await fetchKakaoUserInfo(kakaoUserToken.access_token as string)
  const kakaoAccount = kakaoUserInfo.kakao_account as any

  // 4050 여성이 아닌 경우
  // if (!verifyTargetCustomer(kakaoUserInfo)) {
  //   return res.redirect(`/sorry?id=${kakaoUserInfo.id}`)
  // }

  const [kakaoUserRows] = await pool.query(getKakaoUser, [kakaoUserInfo.id])
  const kakaoUser = (kakaoUserRows as any)[0]

  // 이미 kakao 소셜 로그인 정보가 존재하는 경우
  if (kakaoUser) {
    // 필수 정보가 없는 경우
    // if (!hasRequiredInfo(kakaoUser)) {
    //   return res.redirect(
    //     `/auth/register?${new URLSearchParams({
    //       jwt,
    //       nickname: kakaoUser.nickname,
    //       phoneNumber: kakaoUser.phone_number,
    //     })}`
    //   )
    // }

    return res.redirect(
      `/auth?${new URLSearchParams({
        jwt: await generateJWT({
          userId: kakaoUser.id,
          isAdmin: Boolean(kakaoUser.is_admin),
        }),
        userId: kakaoUser.id,
      })}`
    )
  }

  // kakao 소셜 로그인 정보가 없는 경우
  const [newUserHeader] = await pool.query(registerKakaoUser, [
    kakaoAccount.profile.nickname,
    kakaoAccount.profile.profile_image_url,
    kakaoAccount.email,
    encodeSex(kakaoAccount.gender),
    kakaoAccount.birthyear,
    kakaoAccount.birthday,
    kakaoAccount.phone_number,
    kakaoUserInfo.id,
  ])
  const insertId = (newUserHeader as any).insertId

  return res.redirect(
    `/auth?${new URLSearchParams({
      jwt: await generateJWT({
        userId: insertId,
        isAdmin: false,
      }),
      userId: insertId,
    })}`
  )
}

async function fetchKakaoUserToken(code: string) {
  const response = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&code=${code}`,
  })

  return (await response.json()) as Record<string, unknown>
}

async function fetchKakaoUserInfo(accessToken: string) {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return (await response.json()) as Record<string, unknown>
}

// function verifyTargetCustomer(user: any) {
//   return (
//     user.kakao_account.gender === 'female' &&
//     new Date().getFullYear() - +user.kakao_account.birthyear >= 40
//   )
// }
