import { Actor, HttpAgent } from "@dfinity/agent";
import {
  canisterId,
  idlFactory,
} from "../../declarations/tswaanda_backend/index";

const host = "https://icp0.io";
const agent = new HttpAgent({ host: host });

export const backendActor = Actor.createActor(idlFactory, {
  agent,
  canisterId: canisterId,
});
