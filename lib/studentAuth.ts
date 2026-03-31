import { createHmac, timingSafeEqual } from 'crypto'

const TOKEN_SECRET =
  process.env.STUDENT_PORTAL_SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  'student-portal-session-secret'

const TOKEN_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30

type StudentSessionTokenPayload = {
  studentId: string
  teacherId: string | null
  issuedAt: number
}

function signValue(value: string) {
  return createHmac('sha256', TOKEN_SECRET).update(value).digest('base64url')
}

export function createStudentSessionToken(studentId: string, teacherId: string | null) {
  const payload: StudentSessionTokenPayload = {
    studentId,
    teacherId,
    issuedAt: Date.now(),
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${encodedPayload}.${signValue(encodedPayload)}`
}

export function verifyStudentSessionToken(token: string | null | undefined) {
  if (!token) {
    return null
  }

  const [encodedPayload, providedSignature] = token.split('.')
  if (!encodedPayload || !providedSignature) {
    return null
  }

  const expectedSignature = signValue(encodedPayload)
  const providedBuffer = Buffer.from(providedSignature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (providedBuffer.length !== expectedBuffer.length) {
    return null
  }

  if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as StudentSessionTokenPayload

    if (!payload.studentId || typeof payload.studentId !== 'string') {
      return null
    }

    if (typeof payload.issuedAt !== 'number' || Date.now() - payload.issuedAt > TOKEN_MAX_AGE_MS) {
      return null
    }

    return payload
  } catch {
    return null
  }
}