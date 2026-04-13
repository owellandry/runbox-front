const NOISY_ERROR_PATTERNS = [
  /Could not establish connection\. Receiving end does not exist\./i,
  /Cannot read properties of undefined \(reading ['"]useCache['"]\)/i
];

const NOISY_CONSOLE_PATTERNS = [
  ...NOISY_ERROR_PATTERNS,
  /Constant ["']VERSION["'] on line \d+ is being redeclared and conflicts with a p5\.js constant/i
];

const NOISY_FILE_HINTS = ['content.js', 'polyfill.js', 'chrome-extension://', 'moz-extension://'];

function matchesKnownNoise(text: string): boolean {
  return NOISY_ERROR_PATTERNS.some((pattern) => pattern.test(text));
}

function matchesKnownConsoleNoise(text: string): boolean {
  return NOISY_CONSOLE_PATTERNS.some((pattern) => pattern.test(text));
}

function isNoisyFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return NOISY_FILE_HINTS.some((hint) => lower.includes(hint));
}

function isKnownExtensionNoise(message: string, filename?: string): boolean {
  if (!matchesKnownNoise(message)) return false;
  if (!filename) return true;
  return isNoisyFile(filename);
}

function extractReasonMessage(reason: unknown): string {
  if (reason instanceof Error) return reason.message;
  if (typeof reason === 'string') return reason;
  return '';
}

function extractReasonStack(reason: unknown): string {
  if (reason instanceof Error && typeof reason.stack === 'string') return reason.stack;
  return '';
}

export function installExtensionNoiseFilter(): void {
  if (typeof window === 'undefined') return;

  const root = window as Window & { __runbox_extension_noise_filter_installed__?: boolean };
  if (root.__runbox_extension_noise_filter_installed__) return;
  root.__runbox_extension_noise_filter_installed__ = true;

  window.addEventListener(
    'error',
    (event) => {
      if (isKnownExtensionNoise(event.message ?? '', event.filename)) {
        event.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const message = extractReasonMessage(event.reason);
      const stack = extractReasonStack(event.reason);
      const fromNoisyFile = isNoisyFile(stack);
      if (matchesKnownNoise(message) || (fromNoisyFile && matchesKnownNoise(stack))) {
        event.preventDefault();
      }
    },
    true
  );

  const originalError = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    const text = args.map((arg) => String(arg)).join(' ');
    if (matchesKnownConsoleNoise(text)) return;
    originalError(...args);
  };

  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    const text = args.map((arg) => String(arg)).join(' ');
    if (matchesKnownConsoleNoise(text)) return;
    originalWarn(...args);
  };
}
