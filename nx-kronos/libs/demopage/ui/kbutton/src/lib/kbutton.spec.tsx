import { render } from '@testing-library/react';

import Kbutton from './kbutton';

describe('Kbutton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Kbutton />);
    expect(baseElement).toBeTruthy();
  });
});
