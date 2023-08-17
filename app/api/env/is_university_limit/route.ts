'use strict'

import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {
  const _LOCK_UNIVERSITY_LIMIT = process.env.LOCK_UNIVERSITY_LIMIT || '1'
  const LOCK_UNIVERSITY_LIMIT = Boolean(Number(_LOCK_UNIVERSITY_LIMIT))

  return NextResponse.json({
    result: 'success',
    value: LOCK_UNIVERSITY_LIMIT
  })
}
