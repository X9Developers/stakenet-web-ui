export const ERROR_STATES = {
    ERROR_SETUP: "ERROR_SETUP",
    ERROR_TRANSFER: "ERROR_TRANSFER",
    ERROR_NETWORK: "ERROR_NETWORK",
  } as const;
  export type ErrorStates = keyof typeof ERROR_STATES;
  
  export const SCREEN_STATES = {
    LOADING: "LOADING",
    EXISTING_BALANCE: "EXISTING_BALANCE",
    SWAP: "SWAP",
    RECOVERY: "RECOVERY",
    LISTENER: "LISTENER",
    STATUS: "STATUS",
    SUCCESS: "SUCCESS",
    ...ERROR_STATES,
  } as const;
  export type ScreenStates = keyof typeof SCREEN_STATES;