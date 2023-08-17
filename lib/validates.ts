'use strict'
import { prisma } from '@/lib/prisma'

const handleExists = async (handle: string) => {
  const queried = await prisma.user.findFirst({
    where: {
      bojHandle: handle
    }
  })
  return (queried !== null)
}

const mailExists = async (mail: string) => {
  const queried = await prisma.user.findFirst({
    where: {
      jnuEmail: mail
    }
  })
  return (queried !== null)
}

const _LOCK_UNIVERSITY_LIMIT = process.env.LOCK_UNIVERSITY_LIMIT || '1'
const LOCK_UNIVERSITY_LIMIT = Boolean(Number(_LOCK_UNIVERSITY_LIMIT))
const mailPassesLimit = (address: string) => {
  return !LOCK_UNIVERSITY_LIMIT || address.match(/.*?@jnu\.ac\.kr/)
}

export { handleExists, mailExists, mailPassesLimit }
