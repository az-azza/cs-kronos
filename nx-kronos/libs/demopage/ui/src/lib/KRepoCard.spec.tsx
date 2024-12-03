import { render } from '@testing-library/react';

import KRepoCard from './KRepoCard';
import { TRepoItem } from '../types';

describe('KRepoCard', () => {
  it('should render successfully', () => {

    const item: TRepoItem = {
      id: 1,
      name: 'test name',
      description: 'test description',
      created_at: 'test date',
      watchers: 111,
      owner: { avatar_url: '' },
    };

    const { baseElement } = render(<KRepoCard item={item} />);
    
    expect(baseElement).toBeTruthy();
  });
});
