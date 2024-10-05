export const annotations = ["only", "skip", "fixme"];
export const expectOptions = ["soft"];
export const describeOptions = ["serial"];

export function regexpIsTest(annotations: string[]): RegExp {
  return new RegExp(`^\\s*(it|test)(?:\\.(?:${annotations.join("|")}))?\\s*\\(\\s*[\\r\\n]*\\s*['"\`]`, "m");
}

export function regexpIsSuite(annotations: string[]): RegExp {
  // return new RegExp(
  //   `^\\s*(describe|test\\.describe|describe\\.serial|test\\.describe\\.serial)(?:\\.(?:${annotations.join(
  //     "|"
  //   )}))?\\s*\\(\\s*[\\s\\S]*?['"\`]`,
  //   "m"
  // );
  return new RegExp(
    `^\\s*(describe|test\\.describe|describe\\.serial|test\\.describe\\.serial)(?:\\.(?:${annotations.join("|")}))?`,
    "m"
  );
}

export function regexpIsExpect(actions: string[]): RegExp {
  return new RegExp(`\\s*(expect)(?:\\.(?:${actions.join("|")}))?\\s*\\(`, "m");
}
