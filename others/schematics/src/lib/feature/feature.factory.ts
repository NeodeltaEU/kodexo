import { Rule, SchematicContext, Tree } from "@angular-devkit/schematics";

export function main(options: FeaturesOptions): Rule {
  options = transform(options);
  return (tree: Tree, context: SchematicContext) => {
    console.log(tree)

    return tree
  };
}

function transform(options: FeaturesOptions): FeaturesOptions {
  return options;
}

type FeaturesOptions = {
  name: string
}
