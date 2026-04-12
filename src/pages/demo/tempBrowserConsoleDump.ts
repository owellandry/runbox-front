interface BrowserConsoleDumpInput {
  templateName: string;
  lines: string[];
}

// Temporary debug helper to mirror editor terminal output in browser console.
export function dumpEditorConsoleToBrowser(input: BrowserConsoleDumpInput): void {
  const templateName = input.templateName?.trim() || 'template desconocido';
  const body = input.lines.join('\n').trim() || '(sin salida)';

  const header = `====== ${templateName} cargado ======`;
  const footer = '==========================';

  console.log(`${header}\nresultado\n${body}\n${footer}`);
}

