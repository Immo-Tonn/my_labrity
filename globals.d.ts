/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Declaration of types for CSS-imports
declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}
