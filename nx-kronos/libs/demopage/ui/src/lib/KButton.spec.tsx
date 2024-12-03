import { render } from '@testing-library/react';

import KButton from './KButton';

describe('KButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<KButton />);
    expect(baseElement).toBeTruthy();
  });
});
