# Claude Code Rules for qr-app

## Supabase Changes
Always use the Supabase MCP tools for any database changes (schema migrations, table modifications, RLS policies, etc.). Never write raw SQL to be run manually — execute it directly via the MCP.

## Auto-push After Changes
After every code change, automatically stage and push to GitHub without waiting to be asked:
```
git add <changed files>
git commit -m "<descriptive message>"
git push
```
