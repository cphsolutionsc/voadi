import { RoomServiceClient, EgressClient } from 'livekit-server-sdk'

function livekitConfig() {
  const host = process.env.LIVEKIT_URL!
    .replace('wss://', 'https://')
    .replace('ws://', 'http://')
  const apiKey = process.env.LIVEKIT_API_KEY!
  const apiSecret = process.env.LIVEKIT_API_SECRET!
  return { host, apiKey, apiSecret }
}

export function roomService() {
  const { host, apiKey, apiSecret } = livekitConfig()
  return new RoomServiceClient(host, apiKey, apiSecret)
}

export function egressService() {
  const { host, apiKey, apiSecret } = livekitConfig()
  return new EgressClient(host, apiKey, apiSecret)
}
