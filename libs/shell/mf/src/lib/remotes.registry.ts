export type RemoteDefinition = {
  key: string;
  path: string;
  exposed: string;
  title: string;
  preload: boolean;
};

export const REMOTES: RemoteDefinition[] = [
  {
    key: 'board',
    path: 'board',
    exposed: 'Routes',
    title: 'Board',
    preload: true,
  },
];
