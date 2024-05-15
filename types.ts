export type Message = {
  text: string;
  media?: string;
  delay?: number;
};

export type Option = {
  nextFlow?: string;
  goBack?: boolean;
  response?: Message[];
  keywords: string[];
  strict?: boolean;
};

export type Flow = {
  keywords?: string[];
  name: string;
  body?: Message[];
  capture?: boolean;
  options?: Option[];
  fallBack?: string;
  timeout?: number;
  action?: string | Function;
};
