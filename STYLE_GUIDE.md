# Style Guide

In order to create a codebase that is intuitive to work with, some uniformity in terms of code style is required. Please review this document before contributing code to ensure that this uniformity is preserved.

## File Names

Names of files and directories should consist of all lowercase characters, with hyphens used to separate words (kebab-case). Folders in the `src/app`directory should consist of all lowercase characters without hyphens in order to create page paths such as `/challengerwelcome`. 

Please name files (including images and other assets) in such a way that the contents of the file are clear simply by reading its name.

For clarity and simplicity, test files (with the exception of snapshots) should use the `.test.ts` suffix rather than `.spec.ts`.

## Folder Structure

Within the components directory, if there are multiple files associated with a single component (for instance an SCSS module), place them in a directory together and then export the component from an index.tsx file in that directory. For example:

    src/ 
    └── components/ 
	    └── my-component/ 
		    ├── my-component.tsx 
		    ├── styles.module.scss 
		    └── index.tsx

If there is only a single file associated with a component, it can be located directly inside `src/components`. Using this method, all components can be imported like so: 

`import { MyComponent } from '@/components/my-component';`

## Exports

For pages and layouts, use `export default`. For everything else, use named exports.

## Class/Method/Function/Variable Names

Please ensure your class/method/function/variable names accurately describe what the thing is or does. Avoid abbreviations as they are usually mostly only convenient to the person who wrote the abbreviation, not so much the person reading it. If your method or function name becomes rather long when it describes everything the method/function does, it may be a sign that it is violating the Single-Responsibility Principle and you should break it down into several smaller functions that each handle one step of the process.

## Case Style

| Entity                          | Case       | Notes                                                                                                                                                                                                         |
| ------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TS Variables                    | camelCase  |                                                                                                                                                                                                               |
| TS Functions                    | camelCase  |                                                                                                                                                                                                               |
| TS Methods                      | camelCase  |                                                                                                                                                                                                               |
| Images imported into TS file    | camelCase  |                                                                                                                                                                                                               |
| TS Classes                      | PascalCase |                                                                                                                                                                                                               |
| React Functional Components     | PascalCase |                                                                                                                                                                                                               |
| TS Enums                        | PascalCase |                                                                                                                                                                                                               |
| TS Exported immutable constants | UPPER_CASE | A value that can be expected to be immutable and is exported for use throughout the application may be declared using ALL_CAPS to emphasize its role as an application-wide constant.                         |
| SCSS Classes                    | snake_case | snake_case works well with SCSS module syntax (importing a styles object into a TS file and then accessing its classes via dot syntax) and is easy to read when applied to short utility classes like "mt_lg" |
| SCSS Variables                  | kebab-case | requires $ prefix                                                                                                                                                                                             |
| SCSS Mixins                     | kebab-case |


## Code Duplication

If you start to notice a pattern of writing the same functionality again and again across multiple components, create an abstraction that can be reused throughout the codebase. Not only will you save yourself and others time, this type of work also helps encourage the use of these patterns where they are valuable and makes your code easier to read.

## Comments

Comments can tell lies. Often, the code around a comment changes but the comment lingers. Developers become uncertain as to why it was put there in the first place, and since they aren't sure whether it is still relevant, they avoid deleting it. The comment then persists, telling a story that is perhaps no longer applicable or is even misleading. Therefore, comments should be used judiciously and according to certain specifications (more on that later). 

Avoid comments that unnecessarily describe granular details of a process. The code itself should be written in such a way that it clearly tells this story on its own. 

Bad:
    
    function name(gn : string, fn: string) {
	  //capitalize the first letter of given name
	  gn = gn.slice(0,1).toUpperCase() + gn.slice(1).toLowerCase();

	  //capitalize the first letter of family name
	  fn = fn.slice(0,1).toUpperCase() + fn.slice(1).toLowerCase();

	  //concatenate fn and gn, separated by a comma and a space
	  const name = `${fn}, ${gn}`;

	  //return name
	  return name;
    }

Good:

    function formatFullName(givenName : string, familyName : string) : string {
      return `${capitalize(familyName)}, ${capitalize(givenName)}`;
    }
    
    function capitalize(str : string) : string {
	  return str.slice(0,1).toUpperCase() + str.slice(1).toLowerCase();
    }

Avoid using comments to describe what JSX is supposed to be rendering. The JSX itself should be written such that it is clear to the reader what is to be rendered. If you feel your JSX is becoming difficult to read, break it down into smaller components and/or use more meaningful HTML elements.

Bad:

    {*/ header */}
    <div>
    </div>

Good:

    <header>
    </header>

Do prefer comments that describe a process from a high-level or provide insight into the rationale behind design decisions.

Do not include code that must be commented or uncommented depending on the environment in which the code is executed. These types of things are easily and often forgotten, and are annoying to hunt through the codebase to find. This is why we have environment variables.

Finally, do describe your code using comments that follow the TSDoc specification. Not only does this specification encourage descriptive comments that focus on a high-level view of your code, it also pairs nicely with modern IDEs and tools for exporting documentation.

More information about TSDoc can be found [here](https://tsdoc.org/).

## Prettier

Prettier is an NPM package that has been added to this project to help automate some aspects of code-style enforcement. Prettier will format things like indentation size, line width, semi-colons, ternary expressions, and more. Simply using Prettier will guarantee a greater degree of uniformity throughout the codebase with little-to-no effort from each developer.

You can set your code editor up so that it formats your code with Prettier each time you save your file. Additionally, when you are just about ready to make a PR, it's a good idea to run `npm run format` to ensure all files have been formatted by Prettier.

## Indentation Size

Code should be indented by 2 spaces per indentation level. This requirement can be taken care of simply by using Prettier as described above.

## Semi-colons

Semi-colons are required at the end of each statement. This requirement can be taken care of simply by using Prettier as described above.

## Simplicity and Consistency

Prefer the simplest words possible (while maintaining precision and clarity) when naming your variables, functions, etc, and use those terms consistently. Follow the principle of least surprise: if two functions serve a similar purpose, or have similar parameters, try to structure their signatures in similar ways. By following this principle, we can create a codebase that is highly intuitive to work with.



# Python Style Guide

## Naming Conventions

### Variables
- Use `snake_case` for variable names.
```python
example_variable = 10
```

### Functions and Methods
- Use `snake_case` for function and method names.
```python
def example_function():
    pass
```

## Documentation

### Docstrings
- Use docstrings to comment and document your code. Docstrings should be used for modules, classes, methods, and functions.
```python
def example_function(param1, param2):
    """
    This is an example function.

    Args:
        param1 (int): The first parameter.
        param2 (str): The second parameter.

    Returns:
        bool: The return value. True for success, False otherwise.
    """
    return True
```

## Code Layout

### Indentation
- Use 4 spaces per indentation level.
```python
def example_function():
    if True:
        print("Hello, world!")
```


### Blank Lines
- Use blank lines to separate top-level functions and class definitions.
- Use blank lines sparingly inside functions to indicate logical sections.

```python
class ExampleClass:
    def __init__(self, value):
        self.value = value

    def example_method(self):
        if self.value:
            return True

        return False
```

