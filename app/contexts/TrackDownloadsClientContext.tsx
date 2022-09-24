import React, { createContext, useContext } from "react"
import { TrackDownloadsClient } from "../clients/TrackDownloadsClient"
import { assertNotUndefined } from "../utils/types"

const TrackDownloadsClientContext = createContext<TrackDownloadsClient | undefined>(undefined)

export function useTrackDownloadsClient(): TrackDownloadsClient {
  const clientContext = assertNotUndefined(
    useContext(TrackDownloadsClientContext),
    "TrackDownloadsClientContext missing, did you wrap the component with a context provider?",
  )

  return clientContext
}

export const TrackDownloadsClientProvider: React.FC<React.PropsWithChildren<{ client: TrackDownloadsClient }>> = ({
  client,
  children,
}) => {
  return (
    <TrackDownloadsClientContext.Provider value={client}>
      {children}
    </TrackDownloadsClientContext.Provider>
  )
}
