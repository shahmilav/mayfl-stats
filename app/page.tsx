"use client";

import { useState } from "react";
import { StatsView } from "@/app/stats-view";
import { DraftBoardView } from "@/app/draft-board-view";
import { ScoreboardView } from "@/app/scoreboard-view";

type Tab = "stats" | "draft" | "scoreboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("stats");

  return (
    <main className="min-h-screen p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <header className="flex flex-col gap-2 border-b border-slate-300 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-emerald-600">MayFL</h1>
            </div>
          </div>

          <nav className="flex gap-4 text-sm font-medium border-b border-slate-200 pb-2">
            {([["stats", "Stats"], ["draft", "Draft Board"], ["scoreboard", "Scoreboard"]] as [Tab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-1 border-b-2 transition-colors ${activeTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </header>

        {activeTab === "draft" ? <DraftBoardView /> : activeTab === "scoreboard" ? <ScoreboardView /> : <StatsView />}
      </div>
    </main>
  );
}
