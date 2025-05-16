
import { ExtendedUnit, AttachedCharacter } from "@/types/extendedUnit";

export const hegemonyExtendedUnits: ExtendedUnit[] = [
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    cost: 20,
    stats: { 
      MOV: "3-3 (9)", 
      W: 2, 
      WP: "🟠", 
      MOR: 1, 
      AVB: 3 
    },
    type: "Human - Infantry",
    profiles: [
      {
        members: "3+",
        attack: {
          members: "3+",
          dice: ["🔴", "🟠", "🟠", "🟠"],
          switches: [
            { value: "❗", effect: "Add 🛡 to your roll" }
          ]
        },
        defense: {
          dice: ["🟢", "🟢", "⚫"],
          switches: [
            { value: "❗", effect: "Add 🛡 to your roll" }
          ],
          conquest: 2
        }
      },
      {
        members: "2-",
        attack: {
          members: "2-",
          dice: ["🟠", "🟡", "🟡", "🟡"],
          switches: [
            { value: "❗", effect: "Add 🛡 to your roll" }
          ]
        },
        defense: {
          dice: ["🔵", "🔵"],
          switches: [
            { value: "❗", effect: "Add 🛡 to your roll" }
          ],
          conquest: 1
        }
      }
    ],
    abilities: {},
    imageUrl: "/art/card/black_legion_bucklemen_card.jpg"
  },
  {
    id: "agressors",
    name: "Aggressors",
    cost: 40,
    stats: { 
      MOV: "3-2 (9)", 
      W: 2, 
      WP: "🟠🟠", 
      MOR: 2, 
      AVB: 1 
    },
    type: "Human - Infantry",
    profiles: [
      {
        members: "3+",
        attack: {
          members: "3+",
          modifier: "⚡+🔴+‼️",
          dice: ["🔴", "🟠", "🟡", "🔵", "⭐"],
          switches: [
            { value: "‼️", effect: "Cancel 1 symbol from your target" },
            { value: "‼️", effect: "Your target receives the disarmed state" }
          ]
        },
        defense: {
          dice: ["🟢", "🔵", "🔵", "⚫"],
          switches: [
            { value: "‼️", effect: "Cancel 1 symbol from your attacker" }
          ],
          conquest: 1
        }
      },
      {
        members: "2-",
        attack: {
          members: "2-",
          modifier: "⚡+🟠+‼️",
          dice: ["🔴", "🔴", "🟡", "🟡"],
          switches: [
            { value: "‼️", effect: "Cancel 1 symbol from your target" }
          ]
        },
        defense: {
          dice: ["🟢", "🔵"],
          switches: [
            { value: "‼️", effect: "Cancel 1 symbol from your attacker" }
          ],
          conquest: 1
        }
      }
    ],
    abilities: {
      skill: [
        {
          name: "Broadswords",
          description: "Target: enemy unit engaged with you. When you declare an attack against the target, shove it (2). Then, displace (4) to engage with your target. Start the combat."
        }
      ],
      passive: [
        {
          name: "Commitment and Composure",
          description: "Do not cancel any die or automatic symbol from your rolls because of being engaged in combat with more than one enemy unit."
        }
      ]
    },
    imageUrl: "/art/card/agressors_card.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    cost: 35,
    stats: { 
      MOV: "2-3 (8)", 
      W: 3, 
      WP: "🟠🟡", 
      MOR: 1, 
      AVB: 2 
    },
    type: "Human - Infantry",
    keywords: ["Cover (♦)", "Immovable"],
    profiles: [
      {
        members: "3+",
        attack: {
          members: "3+",
          dice: ["🔴", "⚫", "⭐"],
          switches: [
            { value: "❗", effect: "If you are engaged, shove (3) your target" }
          ]
        },
        defense: {
          dice: ["🟢", "⚫", "⚫", "⚫"],
          switches: [
            { value: "‼️‼️", effect: "Add 🛡 to your roll" }
          ],
          conquest: 1
        }
      },
      {
        members: "2-",
        attack: {
          members: "2-",
          dice: ["🟠", "🟡", "⭐"],
          switches: [
            { value: "❗", effect: "If you are engaged, shove (3) your target" }
          ]
        },
        defense: {
          dice: ["🟢", "🔵", "🔵"],
          switches: [
            { value: "‼️‼️", effect: "Add 🛡 to your roll" }
          ],
          conquest: 1
        }
      }
    ],
    abilities: {
      skill: [
        {
          name: "Charger's Folly",
          description: "When an enemy unit charges or assaults you, add 1⭐ to your defense roll. If your attacker is Cavalry or Large, add 1 additional ⭐. You may repeat 1 die from your defense roll."
        },
        {
          name: "Hold Position",
          description: "Add 1 to your conquest value for each allied Infantry or Cavalry unit (that is not a Character) within 5 strides."
        }
      ],
      command: [
        {
          name: "Taunt the Enemy",
          description: "Target: Non-Character enemy unit within 10 strides. If your target can charge or assault you, it is forced to do so unless it passes a WP test with 2⭐ (it is not considered activated). Your target may suffer 1 stress and repeat 1 die from its WP roll (only once). Your target cannot activate the switches of its attack roll."
        }
      ]
    },
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    cost: 30,
    stats: { 
      MOV: "3-2 (7)", 
      W: 2, 
      WP: "🟠", 
      MOR: 1, 
      AVB: 2 
    },
    type: "Human - Infantry",
    keywords: ["Cover (♦)"],
    profiles: [
      {
        members: "3+",
        ranged: {
          range: 12,
          dice: ["🔴", "🟠", "🟡", "🟡", "🟡"],
          switches: [
            { value: "❗", effect: "Inflict 1💧 to your target" }
          ]
        },
        attack: {
          members: "3+",
          dice: ["🟠", "🟠", "🟡", "🟡"]
        },
        defense: {
          dice: ["🟢", "🔵", "⬛"],
          switches: [
            { value: "❗", effect: "Add 🛡 to your roll" }
          ],
          conquest: 1
        }
      },
      {
        members: "2-",
        ranged: {
          range: 12,
          dice: ["🟠", "🟡", "🟡", "🟡"],
          switches: [
            { value: "❗", effect: "Inflict 1💧 to your target" }
          ]
        },
        attack: {
          members: "2-",
          dice: ["🟠", "🟡", "🟡", "🟡"]
        },
        defense: {
          dice: ["🟢", "⬛"],
          switches: [
            { value: "❗", effect: "Add 🛡 to your roll" }
          ],
          conquest: 0
        }
      }
    ],
    abilities: {
      passive: [
        {
          name: "Point Blank",
          description: "Add 1⭐ to your ranged attack against units within 8 strides. If you inflict at least 1💧, your target receives the frightened state. Remember, you may apply these effects when you *Hold and shoot.*"
        }
      ],
      command: [
        {
          name: "Pavise",
          description: "Add 1 🛡 to your defense roll. You may repeat a die from your defense roll."
        }
      ]
    },
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    cost: 35,
    stats: { 
      MOV: "2-3 [8]", 
      W: 3, 
      WP: "🔶🔶", 
      MOR: 2, 
      AVB: 1 
    },
    type: "Dwarf - Ghent - Infantry",
    keywords: ["Dispel (🔷)", "Scout"],
    profiles: [
      {
        members: "2+",
        ranged: {
          range: 10,
          modifier: "-",
          dice: ["🔴", "🔴", "🔴", "🔴", "🟡"],
          switches: [
            { value: "‼️", effect: "Shove (3) your target. If you already activated this switch, cancel 🛡 from your target instead" },
            { value: "❗", effect: "Your target receives the disarmed state" }
          ]
        },
        attack: {
          members: "2+",
          modifier: "-",
          dice: ["🔴", "🔴", "🔴", "🟡", "🟡"]
        },
        defense: {
          modifier: "-",
          dice: ["🔵"],
          conquest: 1
        }
      },
      {
        members: "1",
        ranged: {
          range: 10,
          dice: ["🔴", "🔴", "🔴", "🟡", "🟡"],
          switches: [
            { value: "", effect: "Your target receives the disarmed state." },
            { value: "", effect: "Your target receives the disarmed state." }
          ]
        },
        attack: {
          members: "1",
          dice: ["🔴", "🔴", "🟡", "🟡", "🟡"]
        },
        defense: {
          dice: ["🔵"],
          conquest: 0
        }
      }
    ],
    abilities: {
      skill: [
        {
          name: "Mortar",
          description: "No LoS. Target: enemy unit within 10 strides not engaged in combat. Resolve a ranged attack against the target. Your roll consists of 1 🔴 per each Pioneer in your unit (Characters do not count) plus 1 🔴 per troop inside the targeted unit (including Supports and up to 3 🔴). If you inflict at least 1 Wound, your target receives the Frightened state."
        },
        {
          name: "Shovelers",
          description: "Place within 5 strides of you a circular terrain element of 6 strides of diameter with the keyword Trap. You cannot place it on an Impasseable element. When an enemy unit gets in touch with your Trap, during its activation, it receives the Slowed state and must roll its defense to 🔴🔴⭐. It will suffer 1 Wound for each uncancelled ⭐. Once activated, remove the Trap."
        }
      ],
      passive: [
        {
          name: "TRENCH YOURSELVES!",
          description: "While you have not activated during the current round (no activation token on you), add 🟢 to your defense roll when you are the target of a ranged or melee attack. Enemy units cannot apply effects for charging or engaging in combat with you via assault."
        }
      ]
    },
    imageUrl: "/art/card/pioneers_card.jpg"
  }
];

export const hegemonyCharacters: AttachedCharacter[] = [
  {
    id: "amelia-hellbroth",
    name: "Amelia Hellbroth",
    wpModifier: "🔶🔶🔶",
    commandModifier: 1,
    attackModifier: "+⚡",
    attackBonus: "⭐",
    defenseModifier: "⚡+🛡",
    defenseBonus: "🛡",
    conquestModifier: 2,
    abilities: {
      passive: [
        {
          name: "Inspiring Leadership",
          description: "All allied units within 20 strides may use your WP instead of theirs."
        },
        {
          name: "Well-Equipped",
          description: "Your unit is immune to the vulnerable and disarmed states."
        }
      ],
      command: [
        {
          name: "Company, Forward!",
          description: "During the No one is left behind step. An allied unit of your choice can move despite having activated during the round."
        }
      ],
      skill: [
        {
          name: "Let's Not Make Fools of Ourselves",
          description: "Once per round. After the resolution of a combat you participate in. Remove the activation token from your unit or from an allied unit within 5 strides."
        }
      ]
    }
  },
  {
    id: "corporal",
    name: "Corporal",
    wpModifier: "🔶🟡",
    commandModifier: 1,
    attackModifier: "⚡+⭐",
    attackBonus: "+⭐",
    defenseModifier: "⚡+🛡",
    conquestModifier: 1,
    abilities: {
      command: [
        {
          name: "Exhort",
          description: "No LoS. Once during your activation. Reduce the stress of an allied unit within 10 strides."
        }
      ],
      passive: [
        {
          name: "You Are the Black Legion!",
          description: "Your unit adds ⭐ to its attack rolls and 🛡 to its defense rolls if it has more troops than the unit or the sum of the units they are engaged with (Supports do not count)."
        }
      ]
    }
  }
];

// Combine all extended units for easy access
export const allExtendedUnits: ExtendedUnit[] = [
  ...hegemonyExtendedUnits
];

