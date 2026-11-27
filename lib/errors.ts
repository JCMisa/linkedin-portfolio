/**
 * An error whose message is safe to show to the user. Any other error thrown
 * inside a server action is logged and replaced with a generic message.
 */
export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}
