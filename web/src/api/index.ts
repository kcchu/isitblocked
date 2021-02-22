import {ObserverServicePromiseClient} from "./observer_grpc_web_pb"

const getBaseURL = () => {
  try {
    if (process.env.SERVER_URL) return process.env.SERVER_URL
  } catch {}
  return location.origin
}

const enableDevTools =
  (typeof window !== "undefined" && (window as any).__GRPCWEB_DEVTOOLS__) ||
  (() => {})


const client = new ObserverServicePromiseClient(getBaseURL())
enableDevTools([client])

export default client