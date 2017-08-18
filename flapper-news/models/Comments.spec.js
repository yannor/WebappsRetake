// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Comment', function() {

  var comment = {title:"test", upvotes:1};

  it('should exist', function() {
    expect(comment).toBeDefined();
  });

  comment.upvotes = comment.upvotes+1;

  it('should be 2 now', function() {
    expect(2).toEqual(comment.upvotes);
  });

});
