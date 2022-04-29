import { ClinicLiteTemplatePage } from './app.po';

describe('ClinicLite App', function() {
  let page: ClinicLiteTemplatePage;

  beforeEach(() => {
    page = new ClinicLiteTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
