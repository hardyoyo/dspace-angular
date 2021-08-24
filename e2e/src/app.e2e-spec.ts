import { ProtractorPage } from './app.po';

describe('protractor App', () => {
  let page: ProtractorPage;

  beforeEach(() => {
    page = new ProtractorPage();
  });

  it('should display translated title "eScholarship DSpace Pilot :: Home"', () => {
    page.navigateTo();
    page.waitUntilNotLoading();
    expect<any>(page.getPageTitleText()).toEqual('eScholarship DSpace Pilot :: Home');
  });

  it('should contain a news section', () => {
    page.navigateTo();
    page.waitUntilNotLoading();
    const text = page.getHomePageNewsText();
    expect<any>(text).toBeDefined();
  });
});
