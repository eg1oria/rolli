declare function ym(counterId: number, action: string, ...params: unknown[]): void;

interface Window {
  ym?: typeof ym;
}
