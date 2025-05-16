
import { Unit } from "@/types/army";
import { syenannTroops } from "./syenann/troops";
import { syenannCharacters } from "./syenann/characters";

export const syenannUnits: Unit[] = [...syenannTroops, ...syenannCharacters];
