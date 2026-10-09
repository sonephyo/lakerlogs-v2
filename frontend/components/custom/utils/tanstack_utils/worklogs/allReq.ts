import {
  workLogPostType,
} from "@/types/worklog/worklogTypes";
import { createClient } from "../../api_utils/req/client";
import { env } from 'next-runtime-env';

const API_BASE =
  env("NEXT_PUBLIC_WORKLOGS_API_URL") ||
  "http://localhost:9081/worklog/api/";

const client = createClient(API_BASE, "worklog");

export async function submitWorkLog(data: workLogPostType) {
  const res = await client.post(API_BASE, data);
  return res.data;
}
export async function getWorkLog(authorName: string) {
  try {
    const res = await client.get(`${API_BASE}/author/${authorName}`);
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return [];
    }
    throw err;
  }
}
