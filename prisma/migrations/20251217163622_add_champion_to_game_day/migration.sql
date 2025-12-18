-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_game_days" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "description" TEXT,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "championId" TEXT,
    "closedAt" DATETIME,
    "finalStandings" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "game_days_championId_fkey" FOREIGN KEY ("championId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_game_days" ("createdAt", "date", "description", "id", "isOpen", "updatedAt") SELECT "createdAt", "date", "description", "id", "isOpen", "updatedAt" FROM "game_days";
DROP TABLE "game_days";
ALTER TABLE "new_game_days" RENAME TO "game_days";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
