import { MongoClient, type Db } from "mongodb"
import dns from "dns"
import { Resolver } from "dns"

// -------------------------------------------------------------------
// The local ISP DNS (172.29.249.3) does not support MongoDB SRV record
// lookups, causing querySrv ECONNREFUSED. We force all DNS queries in
// this Node.js process to go through Google (8.8.8.8) and Cloudflare
// (1.1.1.1) which correctly resolve mongodb+srv:// SRV records.
// -------------------------------------------------------------------

// 1. Set global DNS servers for all standard dns module calls
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"])

// 2. Create a custom Resolver pointed at Google DNS and monkey-patch
//    the module-level resolveSrv so MongoDB driver's SRV lookups always
//    go through it, even if the global servers get reset elsewhere.
const googleResolver = new Resolver()
googleResolver.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"])
// @ts-ignore – override to guarantee MongoDB SRV queries use Google DNS
dns.resolveSrv = googleResolver.resolveSrv.bind(googleResolver)

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached: { client: MongoClient; db: Db } | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cached) {
    return cached
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 15000,
  })
  const db = client.db("driftmap")

  cached = { client, db }
  return cached
}
