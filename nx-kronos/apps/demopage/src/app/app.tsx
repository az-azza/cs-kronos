// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import '@radix-ui/themes/styles.css';

import { BrowserRouter, Routes, Route, NavLink } from 'react-router';

import { Theme, Container, Flex } from '@radix-ui/themes';

import { GitHubList } from '@kronos/features';

import { tv } from 'tailwind-variants';

const Nav = () => {
  const navTV = tv({
    base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80',
    variants: {
      color: {
        blue: 'bg-blue-500 hover:bg-blue-700',
        lime: 'bg-lime-500 hover:bg-lime-700',
      },
    },
  });

  return (
    <nav>
      <Container maxWidth="100%" className="pt-10 pl-10">
        <Flex gap="3" align="center">
          <NavLink className={navTV({ color: 'blue' })} to="/theme1" end>
            Theme Blue
          </NavLink>
          <NavLink className={navTV({ color: 'lime' })} to="/theme2" end>
            Theme Green
          </NavLink>
        </Flex>
      </Container>
    </nav>
  );
};

export const Home = () => {
  return (
    <Container>
      <Nav />
    </Container>
  );
};

export const Theme1 = () => {
  return (
    <Theme accentColor="blue" grayColor="sage" scaling="95%" appearance="dark">
      <Container>
        <Nav />
        <GitHubList />
      </Container>
    </Theme>
  );
};

export const Theme2 = () => {
  return (
    <Theme accentColor="lime" grayColor="sage" scaling="95%" appearance="dark">
      <Container>
        <Nav />
        <GitHubList />
      </Container>
    </Theme>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Theme1 />} />
        <Route path="theme1" element={<Theme1 />} />
        <Route path="theme2" element={<Theme2 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
