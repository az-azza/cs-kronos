import { render } from '@testing-library/react';

import GitHubList from './GitHubList';

describe('GitHubList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GitHubList />);
    expect(baseElement).toBeTruthy();
  });
});
