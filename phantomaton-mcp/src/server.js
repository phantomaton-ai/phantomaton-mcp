import { MCPServer } from '@mcp/sdk';

/**
 * Starts an MCP server that exposes the given tools.
 * @param {Array<any>} commands - The commands to expose as MCP tools.
 */
export function startMCPServer(commands) {
  const server = new MCPServer({
    transport: 'stdio',
  });

  for (const command of commands) {
    server.createTool({
      name: command.name,
      description: command.description,
      inputSchema: command.example.attributes, // Assuming example attributes can be used as schema
      execute: (input) => command.execute(input),
    });
  }

  server.start();
  console.log('MCP server started');
}
