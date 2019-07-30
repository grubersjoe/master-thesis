// var foo => var FOO
module.exports = function() {
  return {
    visitor: {
      Identifier(path) {
        path.node.name = path.node.name.toUpperCase();
      }
    }
  };
};
