import { render } from '@testing-library/react';

import Githublist from './githublist';

describe('Githublist', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Githublist />);
    expect(baseElement).toBeTruthy();
  });
});
