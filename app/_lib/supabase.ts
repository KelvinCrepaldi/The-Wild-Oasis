import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const url = process.env.SUPABASE_URL || ""
const key = process.env.SUPABASE_KEY || ""

export const supabase = createClient<Database>(url, key)