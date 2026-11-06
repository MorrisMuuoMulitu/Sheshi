import { topic } from "./topic";
import { resource } from "./resource";
import { campaign } from "./campaign";
import { event } from "./event";
import { workItem } from "./workItem";
import { story } from "./story";
import { message } from "./message";
import { settings } from "./settings";

export const schemaTypes = [
  // Content
  topic,
  resource,
  campaign,
  workItem,
  // Submissions
  event,
  story,
  message,
  // Settings
  settings,
];

export { structure } from "./structure";
