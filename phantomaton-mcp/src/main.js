import plugins from 'phantomaton-plugins';
import execution from 'phantomaton-execution';
import { startMCPServer } from './server.js';
import { startMCPClient } from './client.js';

export default ({ configuration, phantomaton }) => {
  const { mcpIn, mcpOut } = configuration;

  if (mcpOut) {
    const commands = phantomaton.container.resolve(execution.command.resolve);
    startMCPServer(commands);
  }

  if (mcpIn) {
    startMCPClient(mcpIn, phantomaton.container);
  }

  return {
    install: [
      // The MCP plugin doesn't register any components itself.
      // It just starts the server and/or client.
    ]
  };
};
