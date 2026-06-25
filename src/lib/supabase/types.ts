import type { Profile, LessonAttempt } from '@prisma/client'

export type { Profile, LessonAttempt }

export type ProfileWithAttempts = Profile & {
  lessonAttempts: LessonAttempt[]
}
