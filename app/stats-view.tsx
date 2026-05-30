"use client";

import { useEffect, useState, type FormEvent } from "react";

type CategoryKey = "passing" | "rushing" | "receiving" | "defensive" | "combined";
type ViewMode = "week" | "overall";
type SortDirection = "asc" | "desc";
type ColumnType = "text" | "number";
type ColumnAggregation = "sum" | "max" | "ratio" | "text";

type RatioConfig = {
  numerator: string;
  denominator: string;
  multiplier?: number;
  decimals?: number;
};

type SheetColumn = {
  key: string;
  label: string;
  type: ColumnType;
  aggregation: ColumnAggregation;
  ratio?: RatioConfig;
};

type StatEntry = {
  id: string;
  week: string;
  player: string;
  values: Record<string, string>;
};

type CategoryDefinition = {
  label: string;
  columns: SheetColumn[];
  starterEntries: StatEntry[];
};

const categoryDefinitions: Record<CategoryKey, CategoryDefinition> = {
  passing: {
    label: "Passing",
    columns: [
      { key: "player", label: "Player", type: "text", aggregation: "text" },
      { key: "passesAttempted", label: "Passes Attempted", type: "number", aggregation: "sum" },
      { key: "passesCompleted", label: "Passes Completed", type: "number", aggregation: "sum" },
      { key: "yards", label: "Yards", type: "number", aggregation: "sum" },
      {
        key: "compPct",
        label: "Comp %",
        type: "number",
        aggregation: "ratio",
        ratio: { numerator: "passesCompleted", denominator: "passesAttempted", multiplier: 100, decimals: 1 },
      },
      {
        key: "yardsPerCompletion",
        label: "Yards Per Completion",
        type: "number",
        aggregation: "ratio",
        ratio: { numerator: "yards", denominator: "passesCompleted", decimals: 1 },
      },
      { key: "longest", label: "LONGEST", type: "number", aggregation: "max" },
      { key: "tds", label: "TDs", type: "number", aggregation: "sum" },
      { key: "ints", label: "INT", type: "number", aggregation: "sum" },
      { key: "fantasyPts", label: "Passing Fantasy Pts", type: "number", aggregation: "sum" },
      { key: "yardsPerGame", label: "Yards/Game", type: "number", aggregation: "text" },
    ],
    starterEntries: [
      {
        id: "passing-1",
        week: "Week 1",
        player: "Jordan Cole",
        values: {
          passesAttempted: "28",
          passesCompleted: "19",
          yards: "284",
          compPct: "67.9",
          yardsPerCompletion: "14.9",
          longest: "52",
          tds: "2",
          ints: "0",
          fantasyPts: "23.60",
        },
      },
      {
        id: "passing-2",
        week: "Week 1",
        player: "Marcus Reed",
        values: {
          passesAttempted: "18",
          passesCompleted: "11",
          yards: "144",
          compPct: "61.1",
          yardsPerCompletion: "13.1",
          longest: "31",
          tds: "1",
          ints: "1",
          fantasyPts: "11.20",
        },
      },
    ],
  },
  rushing: {
    label: "Rushing",
    columns: [
      { key: "player", label: "Player", type: "text", aggregation: "text" },
      { key: "carries", label: "Carries", type: "number", aggregation: "sum" },
      { key: "rushYards", label: "Rush Yards", type: "number", aggregation: "sum" },
      { key: "touchdowns", label: "Touchdowns", type: "number", aggregation: "sum" },
      { key: "longest", label: "Longest", type: "number", aggregation: "max" },
      {
        key: "yardsPerCarry",
        label: "Yards Per Carry",
        type: "number",
        aggregation: "ratio",
        ratio: { numerator: "rushYards", denominator: "carries", decimals: 1 },
      },
      { key: "fantasyPts", label: "Rushing Fantasy Pts", type: "number", aggregation: "sum" },
      { key: "rushYardsPerGame", label: "Rush Yds/Game", type: "number", aggregation: "text" },
    ],
    starterEntries: [
      {
        id: "rushing-1",
        week: "Week 1",
        player: "Avery Stone",
        values: {
          carries: "21",
          rushYards: "118",
          touchdowns: "1",
          longest: "31",
          yardsPerCarry: "5.6",
          fantasyPts: "18.80",
        },
      },
    ],
  },
  receiving: {
    label: "Receiving",
    columns: [
      { key: "player", label: "Player", type: "text", aggregation: "text" },
      { key: "receptions", label: "Receptions", type: "number", aggregation: "sum" },
      { key: "receptionYards", label: "Receiving Yards", type: "number", aggregation: "sum" },
      { key: "touchdowns", label: "Touchdowns", type: "number", aggregation: "sum" },
      { key: "longest", label: "Longest", type: "number", aggregation: "max" },
      {
        key: "yardsPerReception",
        label: "Yards Per Reception",
        type: "number",
        aggregation: "ratio",
        ratio: { numerator: "receptionYards", denominator: "receptions", decimals: 1 },
      },
      { key: "fantasyPts", label: "Receiving Fantasy Pts", type: "number", aggregation: "sum" },
      { key: "receptionYardsPerGame", label: "Rec Yds/Game", type: "number", aggregation: "text" },
    ],
    starterEntries: [
      {
        id: "receiving-1",
        week: "Week 1",
        player: "Noah Blake",
        values: {
          receptions: "9",
          receptionYards: "112",
          touchdowns: "1",
          longest: "27",
          yardsPerReception: "12.4",
          fantasyPts: "18.20",
        },
      },
    ],
  },
  combined: {
    label: "Fantasy Leaderboard",
    columns: [
      { key: "player", label: "Player", type: "text", aggregation: "text" },
      { key: "fantasyPts", label: "Fantasy Pts", type: "number", aggregation: "sum" },
    ],
    starterEntries: [],
  },
  defensive: {
    label: "Defensive",
    columns: [
      { key: "player", label: "Player", type: "text", aggregation: "text" },
      { key: "sacks", label: "Sacks", type: "number", aggregation: "sum" },
      { key: "ints", label: "INTs", type: "number", aggregation: "sum" },
      { key: "fumbles", label: "Fumbles", type: "number", aggregation: "sum" },
      { key: "pds", label: "PDs", type: "number", aggregation: "sum" },
      { key: "tds", label: "TDs", type: "number", aggregation: "sum" },
    ],
    starterEntries: [
      {
        id: "defensive-1",
        week: "Week 1",
        player: "Eli Carter",
        values: {
          sacks: "2",
          ints: "1",
          fumbles: "0",
          pds: "3",
          tds: "0",
        },
      },
    ],
  },
};

const editableCategories: CategoryKey[] = ["passing", "rushing", "receiving", "defensive"];

type PersistedState = {
  players: string[];
  currentWeek: string;
  viewMode: ViewMode;
  sortState: Record<CategoryKey, { key: string; direction: SortDirection }>;
  entries: Record<CategoryKey, StatEntry[]>;
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function uniqueNames(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function cloneEntries(entries: Record<CategoryKey, StatEntry[]>) {
  return {
    passing: entries.passing.map((entry) => ({ ...entry, values: { ...entry.values } })),
    rushing: entries.rushing.map((entry) => ({ ...entry, values: { ...entry.values } })),
    receiving: entries.receiving.map((entry) => ({ ...entry, values: { ...entry.values } })),
    defensive: entries.defensive.map((entry) => ({ ...entry, values: { ...entry.values } })),
    combined: (entries.combined ?? []).map((entry) => ({ ...entry, values: { ...entry.values } })),
  } satisfies Record<CategoryKey, StatEntry[]>;
}

function buildInitialState(): PersistedState {
  const emptyEntries = {
    passing: [],
    rushing: [],
    receiving: [],
    defensive: [],
    combined: [],
  };

  const initialPlayers: never[] = [];

  const initialSortState = Object.fromEntries(
    (Object.keys(categoryDefinitions) as CategoryKey[]).map((key) => [
      key,
      { key: "player", direction: "asc" as SortDirection },
    ]),
  ) as Record<CategoryKey, { key: string; direction: SortDirection }>;

  return {
    players: initialPlayers,
    currentWeek: "Week 1",
    viewMode: "overall",
    sortState: initialSortState,
    entries: cloneEntries(emptyEntries),
  };
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function isZeroLike(value: string) {
  return value.trim() === "" || Number(value) === 0;
}

function formatNumber(value: number, decimals = 0) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (decimals > 0) {
    return value.toFixed(decimals);
  }

  return `${Math.round(value)}`;
}

function isBlankPlayerRow(row: Record<string, string>, columns: SheetColumn[]) {
  return columns
    .filter((column) => column.key !== "player")
    .every((column) => isZeroLike(row[column.key] ?? ""));
}

function findPlayerEntry(entries: StatEntry[], week: string, player: string) {
  return entries.find((entry) => entry.week === week && entry.player === player);
}

function aggregatePlayerEntries(category: CategoryKey, player: string, entries: StatEntry[]) {
  const definition = categoryDefinitions[category];
  const playerEntries = entries.filter((entry) => entry.player === player);

  const totals: Record<string, number> = {};

  for (const column of definition.columns) {
    if (column.key === "player") {
      continue;
    }

    if (column.aggregation === "sum" || column.aggregation === "max") {
      totals[column.key] = 0;
    }
  }

  for (const entry of playerEntries) {
    for (const column of definition.columns) {
      if (column.key === "player" || column.aggregation === "ratio") {
        continue;
      }

      const currentValue = toNumber(entry.values[column.key] ?? "0");

      if (column.aggregation === "sum") {
        totals[column.key] = (totals[column.key] ?? 0) + currentValue;
      }

      if (column.aggregation === "max") {
        totals[column.key] = Math.max(totals[column.key] ?? 0, currentValue);
      }
    }
  }

  const entryCount = playerEntries.length;

  const row: Record<string, string> = { player };

  for (const column of definition.columns) {
    if (column.key === "player") {
      continue;
    }

    if (column.aggregation === "sum") {
      const decimals = column.key === "fantasyPts" ? 2 : 0;
      row[column.key] = formatNumber(totals[column.key] ?? 0, decimals);
      continue;
    }

    if (column.aggregation === "max") {
      row[column.key] = formatNumber(totals[column.key] ?? 0);
      continue;
    }

    if (column.aggregation === "ratio" && column.ratio) {
      const numerator = totals[column.ratio.numerator] ?? 0;
      const denominator = totals[column.ratio.denominator] ?? 0;
      const multiplier = column.ratio.multiplier ?? 1;
      const value = denominator === 0 ? 0 : (numerator / denominator) * multiplier;
      row[column.key] = formatNumber(value, column.ratio.decimals ?? 1);
    }
  }

  if (entryCount > 0) {
    if (category === "passing") {
      row["yardsPerGame"] = formatNumber((totals["yards"] ?? 0) / entryCount, 1);
    }
    if (category === "rushing") {
      row["rushYardsPerGame"] = formatNumber((totals["rushYards"] ?? 0) / entryCount, 1);
    }
    if (category === "receiving") {
      row["receptionYardsPerGame"] = formatNumber((totals["receptionYards"] ?? 0) / entryCount, 1);
    }
  }

  return row;
}

function compareRows(
  left: Record<string, string>,
  right: Record<string, string>,
  column: SheetColumn,
  direction: SortDirection,
) {
  const leftValue = left[column.key] ?? "";
  const rightValue = right[column.key] ?? "";
  let comparison = 0;

  if (column.type === "number") {
    comparison = toNumber(leftValue) - toNumber(rightValue);
  } else {
    comparison = leftValue.localeCompare(rightValue);
  }

  if (comparison === 0 && column.key !== "player") {
    comparison = (left.player ?? "").localeCompare(right.player ?? "");
  }

  return direction === "asc" ? comparison : -comparison;
}

const editAccessCookieName = "mayfl-stats-edit-access";
const editAccessPassword = "milav123";

type PendingAction =
  | { type: "add" }
  | { type: "edit"; player: string; week?: string; entryId?: string }
  | null;

function hasEditAccessCookie() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split("; ")
    .some((cookie) => cookie === `${editAccessCookieName}=1` || cookie.startsWith(`${editAccessCookieName}=`));
}

function grantEditAccessCookie() {
  document.cookie = `${editAccessCookieName}=1; Max-Age=${60 * 60 * 24 * 30}; Path=/; SameSite=Lax`;
}

export function StatsView() {
  const initialState = buildInitialState();
  const [players, setPlayers] = useState<string[]>(initialState.players);
  const [rosterTeams, setRosterTeams] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [currentWeek, setCurrentWeek] = useState(initialState.currentWeek);
  const [viewMode, setViewMode] = useState<ViewMode>(initialState.viewMode);
  const [sortState, setSortState] = useState(initialState.sortState);
  const [entries, setEntries] = useState<Record<CategoryKey, StatEntry[]>>(initialState.entries);
  const [hasLoadedDatabaseState, setHasLoadedDatabaseState] = useState(false);
  const [canPersistDatabaseState, setCanPersistDatabaseState] = useState(false);
  const [databaseLoadError, setDatabaseLoadError] = useState<string | null>(null);
  const [persistenceError, setPersistenceError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("passing");
  const [showPerGame, setShowPerGame] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetch("/roster.json")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;

        if (Array.isArray(data)) {
          const names: string[] = [];
          const teams: Record<string, string> = {};

          for (const item of data) {
            if (!item || typeof item !== "object" || !("player" in item)) {
              continue;
            }

            const player = (item as Record<string, unknown>).player;
            const team = (item as Record<string, unknown>).team;
            const playerName = typeof player === "string" ? player : String(player ?? "");

            if (!playerName) {
              continue;
            }

            names.push(playerName);

            if (typeof team === "string" && team.trim()) {
              teams[playerName] = team.trim();
            }
          }

          const fromFile = uniqueNames(names);

          if (fromFile.length > 0) {
            setPlayers((current) => uniqueNames([...fromFile, ...current]));
            setRosterTeams((current) => ({ ...teams, ...current }));
          }
        }
      })
      .catch(() => {
      });

    return () => {
      mounted = false;
    };
  }, []);

  const teamOptions = [
    "all",
    ...uniqueNames(Object.values(rosterTeams).filter(Boolean)),
  ];

  useEffect(() => {
    let cancelled = false;

    async function loadDatabaseState() {
      try {
        const response = await fetch("/api/state");

        if (!response.ok) {
          if (!cancelled) {
            await response.text();
            setDatabaseLoadError("Stats are unavailable right now. Try again later.");
          }

          if (!cancelled) {
            setHasLoadedDatabaseState(true);
          }

          return;
        }

        const payload = (await response.json()) as { state?: Partial<PersistedState> | null };

        if (!cancelled && payload.state) {
          setDatabaseLoadError(null);
          setPersistenceError(null);
          setCanPersistDatabaseState(true);

          const remoteState = payload.state;

          if (Array.isArray(remoteState.players) && remoteState.players.length > 0) {
            setPlayers(uniqueNames(remoteState.players));
          }

          if (typeof remoteState.currentWeek === "string" && remoteState.currentWeek.trim()) {
            setCurrentWeek(remoteState.currentWeek);
          }

          if (remoteState.viewMode === "week" || remoteState.viewMode === "overall") {
            setViewMode(remoteState.viewMode);
          }

          if (remoteState.sortState) {
            setSortState(remoteState.sortState);
          }

          if (remoteState.entries) {
            const loaded = remoteState.entries as Record<CategoryKey, StatEntry[]>;
            const withDerived: Record<CategoryKey, StatEntry[]> = {
              passing: [],
              rushing: [],
              receiving: [],
              defensive: [],
              combined: [],
            };

            for (const cat of Object.keys(loaded) as CategoryKey[]) {
              withDerived[cat] = (loaded[cat] ?? []).map((entry) => ({
                ...entry,
                values: { ...(entry.values ?? {}), ...computeDerivedForCategory(cat, entry.values ?? {}) },
              }));
            }

            setEntries(cloneEntries(withDerived));
          }
        } else if (!cancelled) {
          setDatabaseLoadError("Stats are unavailable right now. Try again later.");
        }
      } catch {
        if (!cancelled) {
          setDatabaseLoadError("Stats are unavailable right now. Try again later.");
        }
      } finally {
        if (!cancelled) {
          setHasLoadedDatabaseState(true);
        }
      }
    }

    loadDatabaseState();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedDatabaseState || !canPersistDatabaseState) {
      return;
    }

    const controller = new AbortController();

    function stripDerived(entriesToStrip: Record<CategoryKey, StatEntry[]>) {
      const out: Record<CategoryKey, StatEntry[]> = {
        passing: [],
        rushing: [],
        receiving: [],
        defensive: [],
        combined: [],
      };

      for (const cat of Object.keys(entriesToStrip) as CategoryKey[]) {
        out[cat] = entriesToStrip[cat].map((entry) => {
          const computed = computeDerivedForCategory(cat, entry.values ?? {});
          const values = { ...entry.values };
          for (const k of Object.keys(computed)) {
            delete values[k];
          }

          return { ...entry, values };
        });
      }

      return out;
    }

    async function persistState() {
      try {
        const cleanedEntries = stripDerived(entries);

        const response = await fetch("/api/state", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            state: {
              players,
              currentWeek,
              viewMode,
              sortState,
              entries: cleanedEntries,
            },
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const message = await response.text();
          setPersistenceError(message || "Could not save to database. Changes may not persist.");
          return;
        }

        setPersistenceError(null);
      } catch {
        setPersistenceError("Could not save to database. Changes may not persist.");
      }
    }

    persistState();

    return () => {
      controller.abort();
    };
  }, [hasLoadedDatabaseState, canPersistDatabaseState, players, currentWeek, viewMode, sortState, entries]);

  const definition = categoryDefinitions[activeCategory];
  const playerColumns = definition.columns.filter((column) => column.key !== "player");
  const currentSortForActive =
    sortState[activeCategory] ?? { key: definition.columns[0]?.key ?? "player", direction: "asc" as SortDirection };

  function displayPlayerLabel(player: string) {
    const team = rosterTeams[player];

    return team ? `${player} (${team})` : player;
  }

  function handlePeriodChange(value: string) {
    if (value === "all-time") {
      setViewMode("overall");
      return;
    }

    setCurrentWeek(value);
    setViewMode("week");
  }

  const filteredPlayers = players.filter((player) => {
    const nameMatch = searchQuery.trim() === "" || player.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const team = rosterTeams[player] ?? "";
    const teamMatch = teamFilter === "all" || team === teamFilter;
    return nameMatch && teamMatch;
  });

  const visibleRows = (() => {
    if (viewMode === "week" && activeCategory !== "combined") {
      return entries[activeCategory]
        .filter((e) => e.week === currentWeek && filteredPlayers.includes(e.player))
        .map((e) => {
          const row = {
            player: e.player,
            _entryId: e.id,
            ...Object.fromEntries(
              playerColumns.map((col) => [col.key, e.values[col.key] ?? ""]),
            ),
          } as Record<string, string>;
          return isBlankPlayerRow(row, definition.columns) ? null : row;
        })
        .filter((row): row is Record<string, string> => row !== null)
        .sort((left, right) => {
          const column = definition.columns.find((item) => item.key === currentSortForActive.key) ?? definition.columns[0];
          return compareRows(left, right, column, currentSortForActive.direction);
        });
    }

    return filteredPlayers
      .map((player) => {
        if (activeCategory === "combined") {
          if (viewMode === "week") {
            let total = 0;
            let games = 0;
            for (const cat of editableCategories) {
              for (const e of entries[cat]) {
                if (e.player === player && e.week === currentWeek) {
                  total += toNumber(e.values?.fantasyPts ?? "0");
                  const gp = toNumber(e.values?.gamesPlayed ?? "0");
                  if (gp > games) games = gp;
                }
              }
            }

            const value = showPerGame && games > 0 ? total / games : total;
            const row = { player, fantasyPts: formatNumber(value, 2) } as Record<string, string>;
            return isBlankPlayerRow(row, categoryDefinitions.combined.columns) ? null : row;
          }

          let total = 0;
          let games = 0;
          const countedWeeks = new Set<string>();
          for (const cat of editableCategories) {
            for (const e of entries[cat]) {
              if (e.player === player) {
                total += toNumber(e.values?.fantasyPts ?? "0");
                if (!countedWeeks.has(e.week)) {
                  countedWeeks.add(e.week);
                  games += toNumber(e.values?.gamesPlayed ?? "0");
                }
              }
            }
          }

          const value = showPerGame && games > 0 ? total / games : total;
          const row = { player, fantasyPts: formatNumber(value, 2) } as Record<string, string>;
          return isBlankPlayerRow(row, categoryDefinitions.combined.columns) ? null : row;
        }

        const row = aggregatePlayerEntries(activeCategory, player, entries[activeCategory]);
        return isBlankPlayerRow(row, definition.columns) ? null : row;
      })
      .filter((row): row is Record<string, string> => row !== null)
      .sort((left, right) => {
        if (activeCategory === "combined") {
          return toNumber(right["fantasyPts"] ?? "0") - toNumber(left["fantasyPts"] ?? "0");
        }

        const column = definition.columns.find((item) => item.key === currentSortForActive.key) ?? definition.columns[0];
        return compareRows(left, right, column, currentSortForActive.direction);
      });
  })();

  function upsertEntry(category: CategoryKey, week: string, player: string, values: Record<string, string>, entryId?: string) {
    const computed = computeDerivedForCategory(category, values);
    const valuesToSave = { ...values, ...computed };

    setEntries((current) => {
      const next = { ...current };
      const nextEntries = [...current[category]];

      if (entryId) {
        const index = nextEntries.findIndex((e) => e.id === entryId);
        if (index >= 0) {
          nextEntries[index] = { ...nextEntries[index], values: { ...nextEntries[index].values, ...valuesToSave } };
        } else {
          nextEntries.push({ id: createId(), week, player, values: valuesToSave });
        }
      } else {
        nextEntries.push({ id: createId(), week, player, values: valuesToSave });
      }

      next[category] = nextEntries;
      return next;
    });
  }

  function handleSort(columnKey: string) {
    setSortState((current) => {
      const currentSort = current[activeCategory] ?? { key: definition.columns[0]?.key ?? "player", direction: "asc" as SortDirection };

      return {
        ...current,
        [activeCategory]: {
          key: columnKey,
          direction: currentSort.key === columnKey && currentSort.direction === "asc" ? "desc" : "asc",
        },
      };
    });
  }

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalPlayer, setModalPlayer] = useState<string>(players[0] ?? "");
  const [modalWeek, setModalWeek] = useState<string>(currentWeek);
  const [modalEntryId, setModalEntryId] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<CategoryKey>(editableCategories[0]);
  const emptyCategoryValues = (cat: CategoryKey) => {
    const cols = categoryDefinitions[cat].columns.filter(
      (c) => c.key !== "player" && c.key !== "fantasyPts" && c.aggregation !== "ratio" && !c.key.endsWith("PerGame"),
    );
    return Object.fromEntries(cols.map((c) => [c.key, ""])) as Record<string, string>;
  };

  const [modalValues, setModalValues] = useState<Record<CategoryKey, Record<string, string>>>(() => ({
    passing: emptyCategoryValues("passing"),
    rushing: emptyCategoryValues("rushing"),
    receiving: emptyCategoryValues("receiving"),
    defensive: emptyCategoryValues("defensive"),
    combined: emptyCategoryValues("combined"),
  }));

  function hasEditAccess() {
    return hasEditAccessCookie();
  }

  function grantEditAccess() {
    grantEditAccessCookie();
  }

  function openAddModalUnlocked() {
    setModalMode("add");
    setModalPlayer(players[0] ?? "");
    setModalWeek(currentWeek);
    setModalEntryId(null);
    setModalTab(editableCategories[0]);
    setModalValues({
      passing: emptyCategoryValues("passing"),
      rushing: emptyCategoryValues("rushing"),
      receiving: emptyCategoryValues("receiving"),
      defensive: emptyCategoryValues("defensive"),
      combined: emptyCategoryValues("combined"),
    });
    setIsModalOpen(true);
  }

  function openEditModalUnlocked(player: string, week?: string, entryId?: string) {
    setModalMode("edit");
    setModalPlayer(player);
    const w = week ?? currentWeek;
    setModalWeek(w);
    setModalEntryId(entryId ?? null);
    loadModalValuesFor(player, w, entryId);
    setModalTab(editableCategories[0]);
    setIsModalOpen(true);
  }

  function promptForEditAccess(action: Exclude<PendingAction, null>) {
    if (hasEditAccess()) {
      if (action.type === "add") {
        openAddModalUnlocked();
      } else {
        openEditModalUnlocked(action.player, action.week, action.entryId);
      }

      return;
    }

    setPendingAction(action);
    setAuthPassword("");
    setAuthError("");
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
    setAuthPassword("");
    setAuthError("");
    setPendingAction(null);
  }

  function requestAddModal() {
    promptForEditAccess({ type: "add" });
  }

  function loadModalValuesFor(player: string, week: string, entryId?: string) {
    const next: Record<CategoryKey, Record<string, string>> = {
      passing: emptyCategoryValues("passing"),
      rushing: emptyCategoryValues("rushing"),
      receiving: emptyCategoryValues("receiving"),
      defensive: emptyCategoryValues("defensive"),
      combined: emptyCategoryValues("combined"),
    };

    if (entryId) {
      for (const cat of editableCategories) {
        const entry = entries[cat].find((e) => e.id === entryId);
        if (entry) {
          for (const key of Object.keys(next[cat])) {
            next[cat][key] = entry.values[key] ?? "";
          }
          break;
        }
      }
    } else {
      for (const cat of editableCategories) {
        const entry = findPlayerEntry(entries[cat], week, player);
        if (entry) {
          for (const key of Object.keys(next[cat])) {
            next[cat][key] = entry.values[key] ?? "";
          }
        }
      }
    }

    setModalValues(next);
  }

  function requestEditModal(player: string, week?: string, entryId?: string) {
    promptForEditAccess({ type: "edit", player, week, entryId });
  }

  function handleModalSave() {
    for (const cat of editableCategories) {
      const values = { ...(modalValues[cat] ?? {}) };

      const hasAny = Object.values(values).some((v) => String(v).trim() !== "");
      if (hasAny) {
        upsertEntry(cat, modalWeek, modalPlayer, values, modalEntryId ?? undefined);
      }
    }

    setPlayers((current) => uniqueNames([...current, modalPlayer]));
    setIsModalOpen(false);
  }

  function handleDeleteWeekStats(player: string, week: string) {
    if (!confirm(`Delete stats for ${player} in ${week}? This cannot be undone.`)) {
      return;
    }

    setEntries((current) => {
      const next: Record<CategoryKey, StatEntry[]> = {
        passing: current.passing.filter((e) => !(e.player === player && e.week === week)),
        rushing: current.rushing.filter((e) => !(e.player === player && e.week === week)),
        receiving: current.receiving.filter((e) => !(e.player === player && e.week === week)),
        defensive: current.defensive.filter((e) => !(e.player === player && e.week === week)),
        combined: (current.combined ?? []).filter((e) => !(e.player === player && e.week === week)),
      };

      return next;
    });

    setIsModalOpen(false);
  }

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (authPassword !== editAccessPassword) {
      setAuthError("Wrong password.");
      return;
    }

    grantEditAccess();
    setIsAuthModalOpen(false);
    setAuthError("");

    const action = pendingAction;
    setPendingAction(null);

    if (action) {
      if (action.type === "add") {
        openAddModalUnlocked();
      } else {
        openEditModalUnlocked(action.player, action.week, action.entryId);
      }
    }
  }

  function computeDerivedForCategory(category: CategoryKey, values: Record<string, string>) {
    const v = (k: string) => toNumber(values[k] ?? "0");
    const out: Record<string, string> = {};

    if (category === "passing") {
      const attempts = v("passesAttempted");
      const comps = v("passesCompleted");
      const yards = v("yards");
      const tds = v("tds");
      const ints = v("ints");

      const compPct = attempts === 0 ? 0 : (comps / attempts) * 100;
      const ypc = comps === 0 ? 0 : yards / comps;

      out["compPct"] = formatNumber(compPct, 1);
      out["yardsPerCompletion"] = formatNumber(ypc, 1);

      const fantasy = yards * 0.04 + tds * 4 + ints * -2;
      out["fantasyPts"] = formatNumber(fantasy, 2);
    }

    if (category === "rushing") {
      const carries = v("carries");
      const yards = v("rushYards");
      const tds = v("touchdowns");

      const ypc = carries === 0 ? 0 : yards / carries;

      out["yardsPerCarry"] = formatNumber(ypc, 1);

      const fantasy = yards * 0.1 + tds * 6;
      out["fantasyPts"] = formatNumber(fantasy, 2);
    }

    if (category === "receiving") {
      const rec = v("receptions");
      const yards = v("receptionYards");
      const tds = v("touchdowns");

      const ypr = rec === 0 ? 0 : yards / rec;

      out["yardsPerReception"] = formatNumber(ypr, 1);

      const fantasy = rec * 1 + yards * 0.1 + tds * 6;
      out["fantasyPts"] = formatNumber(fantasy, 2);
    }

    if (category === "defensive") {
      const sacks = v("sacks");
      const ints = v("ints");
      const fumbles = v("fumbles");
      const tds = v("tds");

      const fantasy = sacks * 1 + ints * 2 + fumbles * 2 + tds * 6;
      out["fantasyPts"] = formatNumber(fantasy, 2);
    }

    return out;
  }

  if (!hasLoadedDatabaseState) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded border border-slate-300 bg-white p-8 text-slate-600">
        Loading stats from Supabase...
      </div>
    );
  }

  if (databaseLoadError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded border border-slate-300 bg-white p-8 text-slate-600">
        {databaseLoadError}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">
          Period
          <select
            value={viewMode === "overall" ? "all-time" : currentWeek}
            onChange={(event) => handlePeriodChange(event.target.value)}
            className="ml-2 rounded border border-slate-300 px-2 py-1 text-sm outline-none focus:border-slate-500"
          >
            {[
              ...Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`),
              "playoff-semis",
              "playoff-championship",
              "all-time",
            ].map((period) => (
              <option key={period} value={period}>
                {period === "all-time" ? "All-time" : period}
              </option>
            ))}
          </select>
        </label>
        {activeCategory === "combined" ? (
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={showPerGame}
              onChange={(e) => setShowPerGame(e.target.checked)}
              className="rounded"
            />
            Pts / Games Played
          </label>
        ) : null}
      </div>

      {persistenceError ? (
        <div className="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900">
          Persistence warning: {persistenceError}
        </div>
      ) : null}

      <section className="rounded border border-slate-300 bg-white p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player"
              className="rounded border border-slate-300 px-2 py-1 text-sm outline-none"
            />

            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="rounded border border-slate-300 px-2 py-1 text-sm outline-none"
            >
              {teamOptions.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All teams" : t === "MM" ? "Minneapolis  Mahesh" : t === "SFFS" ? "SF Flying Squirrels" : t === "PGP" ? "Pyongyang Giant Pandas" : t === "TAT" ? "Tel Aviv Teletubbies" : t === "SSQT" ? "Seattle Side Quest Turtles" : t}
                </option>
              ))}
            </select>
          </div>
          {(Object.keys(categoryDefinitions) as CategoryKey[]).map((categoryKey) => {
            const isActive = categoryKey === activeCategory;

            return (
              <button
                key={categoryKey}
                type="button"
                onClick={() => setActiveCategory(categoryKey)}
                className={`rounded border px-2 py-1 text-sm font-medium ${isActive ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 text-slate-700 hover:border-emerald-400"
                  }`}
              >
                {categoryDefinitions[categoryKey].label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={requestAddModal}
            className="ml-auto rounded border px-2 py-1 text-sm font-medium border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          >
            + Add Week Stats
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-sm table-fixed">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                {activeCategory === "combined" ? (
                  <th className="border border-slate-300 p-0 text-left font-medium px-2 py-1 w-12">#</th>
                ) : null}
                {definition.columns.filter((c) => viewMode !== "week" || !c.key.endsWith("PerGame")).map((column) => {
                  const isSorted = currentSortForActive.key === column.key;

                  const widthClass = column.key === "player" ? "w-48" : column.key === "fantasyPts" ? "w-36 text-right" : "";

                  return (
                    <th key={column.key} className={`border border-slate-300 p-0 text-left font-medium ${widthClass}`}>
                      <button
                        type="button"
                        onClick={activeCategory === "combined" ? undefined : () => handleSort(column.key)}
                        className={`flex w-full items-center justify-between gap-2 px-2 py-1 text-left ${activeCategory === "combined" ? "cursor-default" : ""
                          }`}
                      >
                        <span>{column.key === "fantasyPts" && activeCategory === "combined" && showPerGame ? "Pts / Game" : column.label}</span>
                        <span className="text-xs text-slate-500">
                          {isSorted ? (currentSortForActive.direction === "asc" ? "▲" : "▼") : ""}
                        </span>
                      </button>
                    </th>
                  );
                })}
                {activeCategory !== "combined" ? (
                  <th className="border border-slate-300 px-2 py-1 text-left font-medium text-slate-700 w-20">
                    {viewMode === "week" ? "Actions" : "\u00A0"}
                  </th>
                ) : null}
              </tr>
            </thead>

            <tbody>
              {visibleRows.length > 0 ? (
                visibleRows.map((row, idx) => {
                  return (
                    <tr key={row._entryId ?? row.player} className="odd:bg-white even:bg-slate-50">
                      {activeCategory === "combined" ? (
                        <td className="border border-slate-300 px-2 py-1 font-medium text-slate-950">{idx + 1}</td>
                      ) : null}
                {definition.columns.filter((c) => viewMode !== "week" || !c.key.endsWith("PerGame")).map((column) => {
                        if (column.key === "player") {
                          return (
                            <td key={column.key} className="border border-slate-300 px-2 py-1 font-medium text-slate-950">
                              {displayPlayerLabel(row.player)}
                            </td>
                          );
                        }

                        return (
                          <td key={column.key} className="border border-slate-300 p-0">
                            <div className="px-2 py-1 text-slate-900">{row[column.key] ?? ""}</div>
                          </td>
                        );
                      })}
                      {activeCategory !== "combined" ? (
                        <td className="border border-slate-300 px-2 py-1 text-slate-500">
                          {viewMode === "week" ? (
                            <button
                              type="button"
                              onClick={() => requestEditModal(row.player, undefined, row._entryId)}
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700"
                            >
                              Edit
                            </button>
                          ) : (
                            <div className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 invisible">&nbsp;</div>
                          )}
                        </td>
                      ) : null}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    className="border border-slate-300 px-3 py-6 text-slate-500"
                    colSpan={
                      definition.columns.filter((c) => viewMode !== "week" || !c.key.endsWith("PerGame")).length + (activeCategory === "combined" ? 1 : 0) + (viewMode === "week" && activeCategory !== "combined" ? 1 : 0)
                    }
                  >
                    No players with non-zero {definition.label.toLowerCase()} stats for this {viewMode === "week" ? currentWeek : "overall"} view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isAuthModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeAuthModal} />
            <form onSubmit={handleAuthSubmit} className="relative z-10 w-full max-w-md rounded bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold">Password Required</h3>
              <p className="mt-1 text-sm text-slate-600">Enter the edit password to add or change stats.</p>

              <label className="mt-4 block text-sm">
                Password
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => {
                    setAuthPassword(e.target.value);
                    if (authError) {
                      setAuthError("");
                    }
                  }}
                  className="mt-1 w-full rounded border px-2 py-1"
                  autoFocus
                />
              </label>

              {authError ? <p className="mt-2 text-sm text-red-600">{authError}</p> : null}

              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={closeAuthModal} className="rounded border px-3 py-2">
                  Cancel
                </button>
                <button type="submit" className="rounded bg-slate-900 px-3 py-2 text-white">
                  Continue
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {isModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
            <div className="relative z-10 w-full max-w-6xl rounded bg-white p-6 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{modalMode === "add" ? "Add Player Week Stats" : "Edit Player Week Stats"}</h3>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Player
                  <select
                    value={modalPlayer}
                    onChange={(e) => {
                      const np = e.target.value;
                      setModalPlayer(np);
                      if (modalMode === "edit") loadModalValuesFor(np, modalWeek);
                    }}
                    className="mt-1 w-full rounded border px-2 py-1"
                  >
                    {players.map((p) => (
                      <option key={p} value={p}>
                        {displayPlayerLabel(p)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm">
                  Week
                  <select
                    value={modalWeek}
                    onChange={(e) => {
                      const nw = e.target.value;
                      setModalWeek(nw);
                      if (modalMode === "edit") loadModalValuesFor(modalPlayer, nw);
                    }}
                    className="mt-1 w-full rounded border px-2 py-1"
                  >
                    {[...Array.from({ length: 10 }, (_, i) => `Week ${i + 1}`), "playoff-semis", "playoff-championship"].map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  {editableCategories.map((cat) => {
                    const def = categoryDefinitions[cat];
                    const isActive = modalTab === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setModalTab(cat)}
                        className={`rounded border px-3 py-1 text-sm font-medium ${isActive ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 text-slate-700"
                          }`}
                      >
                        {def.label}
                      </button>
                    );
                  })}
                </div>

                <div className="rounded border border-slate-200 p-3">
                  <div className="mb-2 text-sm font-medium">{categoryDefinitions[modalTab].label}</div>
                  <div className="grid gap-2 md:grid-cols-3">
                    {categoryDefinitions[modalTab].columns
                      .filter((c) => c.key !== "player" && c.key !== "fantasyPts" && c.aggregation !== "ratio" && !c.key.endsWith("PerGame"))
                      .map((col) => (
                        <label key={col.key} className="text-sm">
                          {col.label}
                          <input
                            value={modalValues[modalTab]?.[col.key] ?? ""}
                            onChange={(e) => setModalValues((cur) => ({ ...cur, [modalTab]: { ...(cur[modalTab] ?? {}), [col.key]: e.target.value } }))}
                            className="mt-1 w-full rounded border px-2 py-1"
                          />
                        </label>
                      ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {modalMode === "edit" ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteWeekStats(modalPlayer, modalWeek)}
                    className="rounded border px-3 py-2 text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                ) : null}
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded border px-3 py-2">Cancel</button>
                <button type="button" onClick={handleModalSave} className="rounded bg-slate-900 px-3 py-2 text-white">Save</button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
