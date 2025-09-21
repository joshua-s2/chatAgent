export interface filterPluginTypes {
  capitalize: (value: string) => string;
  obfuscateEmail: (value: string, totalLength: number) => string;
  darkenColor: (hex: string, percentage: number) => string;
  generateRandomColor: (letter?: string) => Array<string>;
  extractFirstLetter: (name: string) => string;
}
