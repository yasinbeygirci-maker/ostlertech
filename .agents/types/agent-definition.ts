// Minimal AgentDefinition types based on Codebuff's official reference:
// https://www.codebuff.com/docs/types/agent-definition
// (`codebuff /init` normally scaffolds this file under .agents/types/.)

export type ModelName = string

export interface AgentStepContext {
  agentState: unknown
  prompt?: string
  params?: Record<string, any>
  logger: {
    info: (message: string) => void
    debug: (message: string) => void
    warn: (message: string) => void
    error: (message: string) => void
  }
}

export type StepCommand = 'STEP' | 'STEP_ALL'

export interface ToolCall {
  toolName: string
  input: any
}

export type StepYield =
  | ToolCall
  | StepCommand
  | { type: 'STEP_TEXT'; text: string }
  | { type: 'GENERATE_N'; n: number }

export type YieldResult = {
  agentState: unknown
  toolResult?: unknown
  stepsComplete?: boolean
  nResponses?: string[]
}

export interface AgentDefinition {
  // Identity
  id: string
  version?: string
  publisher?: string
  displayName: string

  // Model
  model: ModelName
  reasoningOptions?: Record<string, unknown>
  providerOptions?: Record<string, unknown>

  // Tools and subagents
  mcpServers?: Record<string, unknown>
  toolNames?: string[]
  spawnableAgents?: string[]

  // Input and output
  inputSchema?: {
    prompt?: { type: 'string'; description?: string }
    params?: Record<string, unknown>
  }
  outputMode?: 'last_message' | 'all_messages' | 'structured_output'
  outputSchema?: Record<string, unknown>

  // Prompts
  spawnerPrompt?: string
  includeMessageHistory?: boolean
  inheritParentSystemPrompt?: boolean
  systemPrompt?: string
  instructionsPrompt?: string
  stepPrompt?: string

  // Programmatic step control
  handleSteps?: (
    context: AgentStepContext
  ) => Generator<StepYield, void, YieldResult>
}
