"use client";

type Game = {
  time: string;
  team1: string;
  team2: string;
  score1?: string;
  score2?: string;
};

type WeekSchedule = {
  date: string;
  label: string;
  games: Game[];
  bye?: string;
};

const teamNames: Record<string, string> = {
  SFFS: "SF Flying Squirrels",
  PGP: "Pyongyang Giant Pandas",
  MM: "Minneapolis Mahesh",
  SSQT: "Seattle Side Quest Turtles",
  TAT: "Tel Aviv Teletubbies",
};

function fullName(abbr: string) {
  return teamNames[abbr] ?? abbr;
}

const schedule: WeekSchedule[] = [
  {
    date: "May 3",
    label: "Week 1",
    games: [
      { time: "3:00 PM", team1: "SFFS", team2: "PGP", score1: "56", score2: "50" },
      { time: "4:30 PM", team1: "MM", team2: "SSQT", score1: "56", score2: "63" },
    ],
    bye: "TAT",
  },
  {
    date: "May 17",
    label: "Week 2",
    games: [
      { time: "12:00 PM", team1: "PGP", team2: "SSQT", score1: "42", score2: "35" },
      { time: "1:30 PM", team1: "SFFS", team2: "TAT", score1: "42", score2: "21" },
    ],
    bye: "MM",
  },
  {
    date: "May 29",
    label: "Week 3",
    games: [
      { time: "3:30 PM", team1: "SSQT", team2: "TAT", score1: "56", score2: "70" },
      { time: "5:00 PM", team1: "PGP", team2: "MM", score1: "119", score2: "49" },
    ],
    bye: "SFFS",
  },
  {
    date: "May 31",
    label: "Week 4",
    games: [
      { time: "2:00 PM", team1: "TAT", team2: "MM" },
      { time: "3:30 PM", team1: "SSQT", team2: "SFFS" },
    ],
    bye: "PGP",
  },
  {
    date: "June 12",
    label: "Week 5",
    games: [
      { time: "3:30 PM", team1: "MM", team2: "SFFS" },
      { time: "5:00 PM", team1: "TAT", team2: "PGP" },
    ],
    bye: "SSQT",
  },
  {
    date: "June 14",
    label: "Week 6",
    games: [
      { time: "2:00 PM", team1: "MM", team2: "SSQT" },
      { time: "3:30 PM", team1: "PGP", team2: "TAT" },
    ],
    bye: "SFFS",
  },
  {
    date: "June 26",
    label: "Week 7",
    games: [
      { time: "3:30 PM", team1: "PGP", team2: "MM" },
      { time: "5:00 PM", team1: "SFFS", team2: "SSQT" },
    ],
    bye: "TAT",
  },
  {
    date: "June 28",
    label: "Week 8",
    games: [
      { time: "3:00 PM", team1: "SFFS", team2: "PGP" },
      { time: "4:30 PM", team1: "TAT", team2: "MM" },
    ],
    bye: "SSQT",
  },
  {
    date: "July 3",
    label: "Week 9",
    games: [
      { time: "3:30 PM", team1: "TAT", team2: "SFFS" },
      { time: "5:00 PM", team1: "SSQT", team2: "PGP" },
    ],
    bye: "MM",
  },
  {
    date: "July 5",
    label: "Week 10",
    games: [
      { time: "2:00 PM", team1: "SSQT", team2: "TAT" },
      { time: "3:30 PM", team1: "MM", team2: "SFFS" },
    ],
    bye: "PGP",
  },
  {
    date: "July 10",
    label: "Playoffs",
    games: [
      { time: "3:30 PM", team1: "1 seed", team2: "4 seed" },
      { time: "5:00 PM", team1: "2 seed", team2: "3 seed" },
    ],
  },
  {
    date: "July 11",
    label: "Award Ceremony",
    games: [],
  },
  {
    date: "July 12",
    label: "Championship",
    games: [
      { time: "2:00 PM", team1: "Winner SF 1v4", team2: "Winner SF 2v3" },
    ],
  },
];

export function ScoreboardView() {
  return (
    <section className="rounded border border-slate-300 bg-white p-4">
      <div className="space-y-6">
        {schedule.map((week) => (
          <div key={week.label + week.date}>
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">
              {week.date} — {week.label}
            </h3>
            {week.games.length > 0 ? (
              <div className="space-y-1">
                {week.games.map((game, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                  >
                    <span className="text-slate-500 w-16 shrink-0">{game.time}</span>
                    {game.score1 !== undefined && game.score2 !== undefined ? (
                      <>
                        <span className="font-medium text-slate-900">{fullName(game.team1)}</span>
                        <span className="font-bold text-emerald-600">{game.score1}</span>
                        <span className="text-slate-400">-</span>
                        <span className="font-bold text-emerald-600">{game.score2}</span>
                        <span className="font-medium text-slate-900">{fullName(game.team2)}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-slate-900">{fullName(game.team1)}</span>
                        <span className="text-slate-400 italic">vs</span>
                        <span className="font-medium text-slate-900">{fullName(game.team2)}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic px-1">{week.label === "Award Ceremony" ? "Award Ceremony" : "TBD"}</p>
            )}
            {week.bye ? (
              <p className="mt-1 text-xs text-slate-500 px-1">
                Bye: <span className="font-medium text-slate-700">{fullName(week.bye)}</span>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
