import { render } from '@testing-library/react';

import MyButton from './myButton';

describe('MyButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MyButton />);
    expect(baseElement).toBeTruthy();
  });
});
