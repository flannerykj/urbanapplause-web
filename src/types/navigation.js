import { History } from 'react-router-dom';

export type Location = {
  search: string
}
export type Match = {
  params: { [key: string]: ?string },
  isExact: boolean,
  path: string,
  url: string,
};
export type NavigationProps = {
  match: Match,
  history: History
}
