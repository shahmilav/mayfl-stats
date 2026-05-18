import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const STATE_ROW_ID = "mayfl-stats-sheet";

function getSupabaseConfig(allowAnon = false) {
  const rawSupabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_KEY;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_KEY;

  const supabaseUrl = rawSupabaseUrl?.includes("http")
    ? rawSupabaseUrl.slice(rawSupabaseUrl.indexOf("http"))
    : rawSupabaseUrl;

  if (!supabaseUrl) return null;

  // Prefer a server-side key for anything that needs to write.
  if (!allowAnon) {
    if (!serviceRoleKey) return null;
    if (serviceRoleKey.startsWith("sb_publishable_") || serviceRoleKey.startsWith("sb_anon_")) {
      return { error: "Supabase key must be a secret/service-role key for server-side writes." } as const;
    }

    return { supabaseUrl: supabaseUrl.replace(/\/$/, ""), serviceRoleKey };
  }

  // allowAnon: read-only paths may use a publishable/anon key
  const keyForRead = serviceRoleKey ?? publishableKey;
  if (!keyForRead) return null;

  return { supabaseUrl: supabaseUrl.replace(/\/$/, ""), serviceRoleKey: keyForRead };
}

async function readStateFromDatabase() {
  // allow anonymous/publishable keys for reads
  const config = getSupabaseConfig(true);

  if (!config) {
    return NextResponse.json({ state: null, configured: false }, { status: 503 });
  }

  if ("error" in config) {
    return NextResponse.json({ error: config.error }, { status: 503 });
  }

  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("app_state")
    .select("data")
    .eq("id", STATE_ROW_ID)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message || "Failed to read state" }, { status: 500 });
  }

  const state = data?.data ?? null;

  return NextResponse.json({ state });
}

async function writeStateToDatabase(request: Request) {
  // writes require a server-side service role/secret key
  const config = getSupabaseConfig(false);

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Supabase environment variables are missing or not suitable for writes. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY / SUPABASE_KEY) with a service_role/secret key.",
      },
      { status: 503 },
    );
  }

  if ("error" in config) {
    return NextResponse.json({ error: config.error }, { status: 503 });
  }

  const body = (await request.json()) as { state?: unknown };

  if (!body || typeof body !== "object" || !("state" in body)) {
    return NextResponse.json({ error: "Missing state payload." }, { status: 400 });
  }

  const supabase = createClient(config.supabaseUrl, config.serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("app_state").upsert(
    {
      id: STATE_ROW_ID,
      data: body.state,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message || "Failed to save state" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return readStateFromDatabase();
}

export async function PUT(request: Request) {
  return writeStateToDatabase(request);
}
