'use strict'
import { handleExists, mailExists } from '@/lib/validates'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const params = new URL(request.url).searchParams
  const _key = String(params.get('key'))
  const key = ['handle', 'mail'].includes(_key) ? _key : 'handle'
  const value = String(params.get('value'))

  let exists: boolean = false
  if (key === 'handle') {
    exists = await handleExists(value)
  } else if (key === 'mail') {
    exists = await mailExists(value)
  }

  if (!exists) {
    return NextResponse.json({
      result: 'success',
      detail: {
        queried: 'not-found'
      }
    })
  } else {
    return NextResponse.json({
      result: 'success',
      detail: {
        queried: 'found'
      }
    })
  }
}
