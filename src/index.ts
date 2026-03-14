#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const BASE_URL = "https://gamelegend.com/api/v1";

const server = new McpServer({
  name: "gamelegend",
  version: "1.0.0",
});

async function callAPI(endpoint: string): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Tool: Search games
server.tool(
  "search_games",
  "Search the GameLegend library by title, description, or Gameplay DNA dimensions. Returns game titles, descriptions, platforms, and URLs.",
  {
    q: z.string().optional().describe("Search query — matches game title and description"),
    dimensions: z.string().optional().describe("Comma-separated dimension IDs to filter by (use get_dimensions to find IDs)"),
    limit: z.number().int().min(1).max(48).optional().describe("Results per page (default 24)"),
    offset: z.number().int().min(0).optional().describe("Pagination offset"),
  },
  async (params) => {
    try {
      const qs = new URLSearchParams();
      if (params.q) qs.set("q", params.q);
      if (params.dimensions) qs.set("dimensions", params.dimensions);
      if (params.limit) qs.set("limit", String(params.limit));
      if (params.offset) qs.set("offset", String(params.offset));

      const data = await callAPI(`/games?${qs}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Failed to search games: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get game details
server.tool(
  "get_game_details",
  "Get full details for a specific game including its Gameplay DNA profile (69 dimensions across mechanics, feel, progression, themes, etc.) and developer-submitted store links.",
  {
    slug: z.string().describe("Game slug identifier (e.g. 'civilization-vi', 'factorio', 'stardew-valley')"),
  },
  async (params) => {
    try {
      const data = await callAPI(`/games/${encodeURIComponent(params.slug)}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Failed to get game: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  }
);

// Tool: Find similar games
server.tool(
  "find_similar_games",
  "Find games similar to a given game, ranked by cosine similarity on Gameplay DNA vectors. Returns similarity scores and shared DNA traits for each match.",
  {
    slug: z.string().describe("Game slug to find similar games for (e.g. 'factorio', 'elden-ring')"),
    limit: z.number().int().min(1).max(48).optional().describe("Results per page (default 24)"),
    offset: z.number().int().min(0).optional().describe("Pagination offset"),
  },
  async (params) => {
    try {
      const qs = new URLSearchParams();
      if (params.limit) qs.set("limit", String(params.limit));
      if (params.offset) qs.set("offset", String(params.offset));

      const data = await callAPI(`/games/${encodeURIComponent(params.slug)}/similar?${qs}`);
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Failed to find similar games: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  }
);

// Tool: Get DNA dimensions
server.tool(
  "get_dimensions",
  "List all 69 Gameplay DNA dimensions grouped by category (mechanics, feel, progression, social_mode, aesthetic, themes, complexity, session_length, strategic_scope). Use dimension IDs to filter games in search_games.",
  {},
  async () => {
    try {
      const data = await callAPI("/dimensions");
      return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
    } catch (error) {
      return {
        content: [{ type: "text" as const, text: `Failed to get dimensions: ${error instanceof Error ? error.message : String(error)}` }],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GameLegend MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
