'use strict'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { handleExists, mailExists, mailPassesLimit } from '@/lib/validates'

const EMAIL_PENDING_TIME_LIMIT = Number(process.env.EMAIL_SENDING_TIME_LIMIT) || 3
const LOGIN_CODE_LENGTH = Number(process.env.LOGIN_CODE_LENGTH) || 10

export const POST = async (request: Request) => {
  const body = await request.json()
  const bojHandle = body['boj-handle'] as string
  const jnuEmail = body['jnu-mail'] as string
  const emailCode = body['mail-code'] as string
  let uploadFile = false

  // check exists
  if (await handleExists(bojHandle)) {
    return NextResponse.json({
      result: 'failed',
      code: 'handle-already-submitted',
      detail: 'BOJ handle already submitted.'
    })
  }

  if (await mailExists(jnuEmail)) {
    return NextResponse.json({
      result: 'failed',
      code: 'mail-already-submitted',
      detail: 'Email already submitted.'
    })
  }

  // boj handle
  if (!bojHandle || bojHandle === '') {
    return NextResponse.json({
      result: 'failed',
      code: 'boj-handle-required',
      detail: 'bojHandle required.'
    })
  }

  // verify email
  if (!jnuEmail || jnuEmail === '') {
    return NextResponse.json({
      result: 'failed',
      code: 'email-required',
      detail: 'email required.'
    })
  }
  if (!mailPassesLimit(jnuEmail)) {
    return NextResponse.json({
      result: 'failed',
      code: 'address-must-jnu',
      detail: '`address` value must be @jnu.ac.kr.'
    }, {
      status: 400
    })
  }
  const queried = await prisma.emailVerify.findFirst({where: { id: jnuEmail }})
  const now = Math.floor(Date.now() / 1000)
  if (queried === null) {
    return NextResponse.json({
      result: 'failed',
      code: 'code-not-issued',
      detail: 'Verification code not be issued to this email.'
    })
  }
  if (now > queried.invoked + EMAIL_PENDING_TIME_LIMIT * 60) {
    return NextResponse.json({
      result: 'failed',
      code: 'code-expired',
      detail: 'Verification code is expired.'
    })
  }
  if (queried.code !== emailCode) {
    return NextResponse.json({
      result: 'failed',
      code: 'invalid-code',
      detail: 'Verification code is not matched.'
    })
  }
  await prisma.user.create({
    data: {
      bojHandle: bojHandle,
      jnuEmail: jnuEmail,
      uploadFile: uploadFile
    }
  })

  const code = crypto.randomBytes(LOGIN_CODE_LENGTH).toString('hex')
  await prisma.loginVerify.create({
    data: {
      id: bojHandle,
      code: code
    }
  })

  return NextResponse.json({
    result: 'success',
    verifyMethod: uploadFile ? 'file' : 'email',
    loginCode: code
  })
}
