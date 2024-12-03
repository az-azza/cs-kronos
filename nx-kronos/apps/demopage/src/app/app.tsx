// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import '@radix-ui/themes/styles.css';

import {
  Theme,
} from '@radix-ui/themes';


import {GitHubList} from '@kronos/features';

export function App() {
  return (
    <Theme accentColor="lime" grayColor="sage" scaling="95%" appearance='dark'>
      <GitHubList />
    </Theme>
  );
}

export default App;
