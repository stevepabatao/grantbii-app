import grants from "@/data/grants.json"
import { Grant } from "./types"

export function getGrants(): Grant[] {
  return grants as Grant[]
}