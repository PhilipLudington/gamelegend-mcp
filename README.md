# gamelegend-mcp

MCP server for [GameLegend](https://gamelegend.com) — game discovery powered by Gameplay DNA.

Search 1,100+ games, explore 69-dimension gameplay profiles, and find similar games via AI-powered cosine similarity.

## Tools

| Tool | Description |
|------|-------------|
| `search_games` | Search games by title, description, or DNA dimensions |
| `get_game_details` | Get full game details with Gameplay DNA profile |
| `find_similar_games` | Find similar games ranked by DNA similarity |
| `get_dimensions` | List all 69 Gameplay DNA dimensions by category |

## Install in Claude Code

```bash
claude mcp add gamelegend -- npx -y gamelegend-mcp
```

## Install in Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "gamelegend": {
      "command": "npx",
      "args": ["-y", "gamelegend-mcp"]
    }
  }
}
```

## No authentication required

The GameLegend API is free and public. Rate limited to 100 requests per minute.

## Example usage

Once installed, ask your AI assistant things like:

- "Find games similar to Factorio"
- "What kind of game is Hades?"
- "Search for cozy farming games"
- "Show me games with turn-based combat and political intrigue"

## License

MIT
