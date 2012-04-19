
// override so all errors thrown will be reported instead
// of hidden during development
SC.THROW_ALL_ERRORS = true;

Console = SC.Application.create(
  /** @scope Console.prototype */ {
  
  NAMESPACE: 'Console',
  VERSION: '1.0'

});
