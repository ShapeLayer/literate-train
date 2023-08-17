'use strict'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { EmailPayload, sendEmail } from '@/lib/mail'
import { mailExists, mailPassesLimit } from '@/lib/validates'

const EMAIL_SENDING_TIME_LIMIT = Number(process.env.EMAIL_SENDING_TIME_LIMIT) || 5
const EMAIL_PENDING_TIME_LIMIT = Number(process.env.EMAIL_PENDING_TIME_LIMIT) || 7
const VERIFY_CODE_LENGTH = Number(process.env.VERIFY_CODE_LENGTH) || 5

const invokeVerifyMail = async (address: string, code: string) => {
  const emailPayload: EmailPayload = {
    to: address,
    subject: "('23 PIMM 알고리즘 파티) 전남대학교 재학생 인증 코드",
    html: `
      안녕하세요. PIMM 알고리즘 스터디입니다.<br>
      백준 온라인 저지에서 열리는 "2023 전남대학교 PIMM 알고리즘 파티"의 전남대학교 재학생 집계를 신청하셨습니다.<br>
      본인이 맞다면 아래 인증 코드를 입력해주세요.<br>
      <br>
      Verify Code: ${code}<br>
      <br>
      이 코드는 ${EMAIL_PENDING_TIME_LIMIT}분동안 유효합니다.
    `
  }
  await sendEmail(emailPayload)
}

export const GET = async (request: NextRequest) => {
  const params = new URL(request.url).searchParams
  const address = String(params.get('address'))
  if (!address) {
    return NextResponse.json({
      result: 'failed',
      code: 'address-required',
      detail: '`address` param required.'
    }, {
      status: 400
    })
  }

  if (await mailExists(address)) {
    return NextResponse.json({
      result: 'failed',
      code: 'mail-already-submitted',
      detail: 'Email already submitted.'
    })
  }

  // must be env
  if (!mailPassesLimit(address)) {
    return NextResponse.json({
      result: 'failed',
      code: 'address-must-jnu',
      detail: '`address` value must be @jnu.ac.kr.'
    }, {
      status: 400
    })
  }
  const queried = await prisma.emailVerify.findFirst({where: { id: address }})
  const code = crypto.randomBytes(VERIFY_CODE_LENGTH).toString('hex')
  const invoked = Math.floor(Date.now() / 1000)
  if (queried === null) {
    await prisma.emailVerify.create({
      data: {
        id: address,
        code: code,
        invoked: invoked
      }
    })
    await invokeVerifyMail(address, code)
  } else {
    if (invoked > queried.invoked + EMAIL_SENDING_TIME_LIMIT * 60) {
      await prisma.emailVerify.update({
        where: { id: address },
        data: { code: code, invoked: invoked }
      })
    } else {
      return NextResponse.json({
        result: 'failed',
        code: 'req-too-often',
        detail: 'Requested too often.',
        EMAIL_SENDING_TIME_LIMIT: EMAIL_SENDING_TIME_LIMIT
      }, {
        status: 400
      })
    }
  }
  return NextResponse.json({
    result: 'success',
    invoked: invoked,
    target: address,
    EMAIL_PENDING_TIME_LIMIT: EMAIL_PENDING_TIME_LIMIT
  })
}
