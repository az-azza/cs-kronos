import { extractGHResponseHeaderLinkPagination } from './extract-gh-response-header-link-pagination';
import { TLinkPagination } from '@kronos/types';

describe('extractGHResponseHeaderLinkPagination', () => {
  it('should work with empty Link', () => {
    expect(extractGHResponseHeaderLinkPagination('')).toEqual(undefined);
  });
  it('should work parsing Link', () => {
    // `<https://api.github.com/repos?page=1&per_page=100>; rel="next",
    // <https://api.github.com/repos?page=50&per_page=100>; rel="last"`

    const link = `<https://api.github.com/repos?page=1&per_page=100>; rel="next",
<https://api.github.com/repos?page=50&per_page=100>; rel="last"`;

    const expected: TLinkPagination = <TLinkPagination>{ last: 50, next: 1 };
    expect(extractGHResponseHeaderLinkPagination(link)).toEqual(expected);
  });
});
