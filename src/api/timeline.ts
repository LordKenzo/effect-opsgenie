import { Effect } from 'effect';
import { TimelineResponseSchema } from '../utils/decoder'

export const getCurrentMonthTimeline = ():
  Effect.Effect<TimelineResponseSchema, Error, never> => {
  const effect = Effect.tryPromise({
    try: async () => {
      const response = await fetch(
        `https://api.opsgenie.com/v2/schedules/${process.env.OPSGENIE_SCHEDULE_ID}/timeline?expand=base&intervalUnit=months`,
        {
          headers: {
            Authorization: `GenieKey ${process.env.OPSGENIE_API_KEY}`,
          },
          signal: AbortSignal.timeout(30000), // 30 seconds timeout
        }
      )
      if (!response.ok) {
        throw new Error(`Opsgenie API error: ${response.status} ${response.statusText}`)
      }
      const data = (await response.json())
      return data
    },
    catch: (e: unknown) => new Error(`Opsgenie API error ${e instanceof Error ? e.message : JSON.stringify(e)}`),
  })
  return effect
}