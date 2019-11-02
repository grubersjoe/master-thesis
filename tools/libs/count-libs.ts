import { ImportDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';

const importMap = new Map<string, number>();

export default function() {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<ImportDeclaration>) {
        const libName = path.node.source.value;
        if (libName !== '..') {
          importMap.set(libName, (importMap.get(libName) || 0) + 1);
        }
      }
    },
    post() {
      importMap.forEach((val, libName) => console.log(libName, val));
    }
  };
};
