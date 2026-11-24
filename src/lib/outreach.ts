import type { ContactRole } from "../types/contact";

// LinkedIn connection notes are short, so every template stays under
// 200 characters even with a long first name.
export const CONNECTION_NOTE_LIMIT = 200;

function firstNameOf(name: string) {
  return name.trim().split(/\s+/)[0] || "there";
}

export function buildIntroMessage(role: ContactRole, name: string): string {
  const first = firstNameOf(name);

  switch (role) {
    case "Recruiter":
      return `Hi ${first}, I'm a frontend developer working with React, TypeScript and Tailwind, and I'm open to new roles. I'd be glad to connect and hear about openings that could fit.`;
    case "Hiring manager":
      return `Hi ${first}, I'm a frontend developer who builds with React and TypeScript. I'd love to connect and learn more about your team and any openings.`;
    case "Mentor":
      return `Hi ${first}, I'm a frontend developer growing my skills in React and TypeScript, and I admire your work. I'd value connecting and learning from your experience.`;
    case "Teammate":
      return `Hi ${first}, great working with you! Let's stay connected here so we can keep in touch and help each other along the way.`;
    case "Client":
      return `Hi ${first}, thanks for the chance to work together. I'd like to stay connected here and keep in touch about future projects.`;
    default:
      return `Hi ${first}, I'm a frontend developer working with React and TypeScript. I'd be glad to connect and stay in touch.`;
  }
}
