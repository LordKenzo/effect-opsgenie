import { Effect } from 'effect';
import { TimelineResponseSchema } from './decoder'

export const getCurrentMonthTimeline = async (): Promise<
  Effect.Effect<TimelineResponseSchema, Error, never>
> => {
  const a = Effect.tryPromise({
    try: async () => {
      const response = await fetch(
        `https://api.opsgenie.com/v2/schedules/${process.env.OPSGENIE_SCHEDULE_ID}/timeline?expand=base&intervalUnit=months`,
        {
          headers: {
            Authorization: `${process.env.OPSGENIE_API_KEY}`,
          },
        }
      )
      const data = (await response.json())
      return data
    },
    catch: (e: any) => new Error(`Opsgenie API error ${JSON.stringify(e)}`),
  })
  return a
}