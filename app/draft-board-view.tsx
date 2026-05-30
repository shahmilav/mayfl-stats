"use client";

const captains = ["Manu (Pyongyang)", "Runbier (Seattle)", "Abeer (Tel Aviv)", "Milav (San Francisco)", "KK (Minneapolis)"];

const draftRounds: { round: number; picks: string[] }[] = [
  { round: 1, picks: ["Pranshu Desai", "Adi Rath", "Maanas Devulapalli", "Adi Mohan", "Sagar Gutti"] },
  { round: 2, picks: ["Dwij Sheth", "Shubham Sharma", "Ben Goodfriend", "Eshan Iyer", "Varun Panalla"] },
  { round: 3, picks: ["Wallace Snow", "Abhi Naine", "John Bridgeford", "Chase Lau", "Keshav Batra"] },
  { round: 4, picks: ["Jeshurun Selvaraj", "Andrew Lin", "Ping-Yu Lu", "Pranshu Agarwal", "Aditya Pochinapeddi"] },
  { round: 5, picks: ["Archyut Ravindran", "Lokesh Kolisetty", "Nick Scarpa", "Sai Polepalle", "Rohan Hota"] },
];

export function DraftBoardView() {
  return (
    <section className="rounded border border-slate-300 bg-white p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border border-slate-300 px-2 py-1 text-left font-medium w-16">Round</th>
              {captains.map((captain) => (
                <th key={captain} className="border border-slate-300 px-2 py-1 text-center font-bold w-48">{captain}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {draftRounds.map((dr) => (
              <tr key={dr.round} className="odd:bg-white even:bg-slate-50">
                <td className="border border-slate-300 px-2 py-1 font-medium text-slate-700">Round {dr.round}</td>
                {dr.picks.map((player, idx) => {
                  const pickNumber = dr.round % 2 === 1
                    ? `${dr.round}.${idx + 1}`
                    : `${dr.round}.${captains.length - idx}`;
                  return (
                    <td key={player} className="border border-slate-300 p-0 relative">
                      <span className="absolute top-0 left-0 text-xs font-bold text-emerald-500 leading-none px-0.5">{pickNumber}</span>
                      <div className="px-2 py-3 text-base text-slate-900 text-center">
                        {player}
                        {player === "Sai Polepalle" ? (
                          <div className="text-[10px] text-slate-400 font-normal mt-0.5 leading-tight">originally Romit Kundu (swapped)</div>
                        ) : null}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
