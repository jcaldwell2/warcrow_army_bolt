
import { SelectedUnit } from "@/types/army";
import { getFactionName } from "@/utils/listFormatUtils";

interface PrintListContentProps {
  units: SelectedUnit[];
  listName: string | null;
  faction: string;
  isCourtesyList?: boolean;
}

export const PrintListContent = ({ units, listName, faction, isCourtesyList }: PrintListContentProps) => {
  const totalPoints = units.reduce((sum, unit) => sum + (unit.pointsCost * (unit.quantity || 1)), 0);
  const totalCommand = units.reduce((sum, unit) => sum + ((unit.command || 0) * (unit.quantity || 1)), 0);

  return `
    <html>
      <head>
        <title>${isCourtesyList ? "Courtesy List" : "Full List"} - ${listName || "Untitled List"}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1, h2, h3 { color: #333; }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .unit {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #eee;
          }
          .unit-name { font-weight: bold; }
          .meta {
            color: #666;
            font-style: italic;
          }
          .command {
            color: #8a6d3b;
            margin-left: 5px;
          }
          .totals {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #333;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.8em;
            color: #666;
          }
          ${isCourtesyList ? '.notice { color: #8a6d3b; margin-top: 10px; font-style: italic; }' : ''}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${listName || "Untitled List"}</h1>
          <p>Faction: ${getFactionName(faction)}</p>
          <p class="meta">Created: ${new Date().toLocaleDateString()}</p>
          ${isCourtesyList ? '<p class="notice">Courtesy List - Scout and Ambusher units hidden</p>' : ''}
        </div>

        <h2>Units</h2>
        <div class="units">
          ${units.map(unit => `
            <div class="unit">
              <div>
                <span class="unit-name">${unit.name}</span>
                ${unit.highCommand ? ' [High Command]' : ''}
                ${unit.command ? `<span class="command">(${unit.command} CP)</span>` : ''}
                ${unit.quantity > 1 ? ` ×${unit.quantity}` : ''}
              </div>
              <div>${unit.pointsCost * (unit.quantity || 1)} pts</div>
            </div>
          `).join('')}
        </div>

        <div class="totals">
          <div>Command Points: ${totalCommand} CP</div>
          <div>Total Points: ${totalPoints} pts</div>
        </div>

        <div class="footer">
          <p>Printed from Warcrow Army Builder</p>
        </div>
      </body>
    </html>
  `;
};
