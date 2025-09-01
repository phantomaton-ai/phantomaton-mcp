import { ClientSession, StdioServerParameters } from '@mcp/sdk';
import { define } from 'phantomaton-plugins';
import { command } from 'phantomaton-execution';

/**
 * Connects to a list of MCP servers, fetches their tools, and registers them as commands.
 * @param {Array<string>} mcpServers - The list of MCP servers to connect to.
 * @param {any} container - The hierophant container.
 */
export async function startMCPClient(mcpServers, container) {
  for (const serverAddress of mcpServers) {
    try {
      const serverParams = new StdioServerParameters({
        command: serverAddress, // Assuming the server address is a command to run
        args: [],
        env: null,
      });

      const session = new ClientSession(serverParams);
      await session.initialize();

      const { tools } = await session.list_tools();

      for (const tool of tools) {
        const newCommand = {
          name: tool.name,
          description: tool.description,
          example: { attributes: tool.inputSchema },
          execute: (input) => session.call_tool(tool.name, input).then(r => r.content),
        };
        container.install(define(command).as(newCommand));
      }

      console.log(`Connected to MCP server at ${serverAddress} and registered ${tools.length} tools.`);
    } catch (error) {
      console.error(`Failed to connect to MCP server at ${serverAddress}:`, error);
    }
  }
}
