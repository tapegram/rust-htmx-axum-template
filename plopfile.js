module.exports = function(plop) {
  plop.setGenerator("web-htmx-component", {
    description: "web-htmx component",
    prompts: [
      {
        type: "input",
        name: "component_name",
        message: "Component name: ",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "web-htmx/src/components",
        templateFiles: "plop-templates/web-htmx-component/*.hbs",
        base: "plop-templates/web-htmx-component",
      },
      {
        path: "web-htmx/src/components.rs",
        template: "pub mod {{snakeCase component_name}};",
        type: "append",
      },
    ],
  });
  plop.setGenerator("web-htmx-resource-singular", {
    description: "web-htmx resource handlers for a singular resource (e.g. /workers/:worker_id, not /workers)",
    prompts: [
      {
        type: "input",
        name: "resource_name",
        message: "Resource name (singular): ",
      },
      {
        type: "input",
        name: "resource_name_plural",
        message: "Resource name (plural) (we need it for a redirect route): ",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "web-htmx/src/resources",
        templateFiles: "plop-templates/web-htmx-resource-singular/*.hbs",
        base: "plop-templates/web-htmx-resource-singular",
      },
      {
        path: "web-htmx/src/resources.rs",
        template: "pub mod {{snakeCase resource_name}};",
        type: "append",
      },
      {
        path: "web-htmx/src/lib.rs",
        pattern: /(\/\/##PLOP USE RESOURCE HOOK##)/g,
        template:
          "$1\nuse resources::{{snakeCase resource_name}}::{{snakeCase resource_name}}_routes;",
        type: "modify",
      },
      {
        path: "web-htmx/src/lib.rs",
        pattern: /(\/\/##PLOP MERGE ROUTE HOOK##)/g,
        template: "$1\n.merge({{snakeCase resource_name}}_routes(state.clone()))",
        type: "modify",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub const {{constantCase resource_name}}: &str = todo!(\"Add route here\");",
        type: "append",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub fn {{snakeCase resource_name}}() -> String { todo!(\"Return hydrated route here\") }",
        type: "append",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub const {{constantCase resource_name}}_EDIT_FORM: &str = todo!(\"Add route here\");",
        type: "append",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub fn {{snakeCase resource_name}}_edit_form() -> String { todo!(\"Return hydrated route here\") }",
        type: "append",
      },
    ],
  });

  plop.setGenerator("web-htmx-resource-plural", {
    description: "web-htmx resource handlers for a plural resource (e.g. /workers, not /workers/:worker_id)",
    prompts: [
      {
        type: "input",
        name: "resource_name",
        message: "Resource name (plural): ",
      },
      {
        type: "input",
        name: "resource_name_singular",
        message: "Resource name (singular, I know, we still need both): ",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "web-htmx/src/resources",
        templateFiles: "plop-templates/web-htmx-resource-plural/*.hbs",
        base: "plop-templates/web-htmx-resource-plural",
      },
      {
        path: "web-htmx/src/resources.rs",
        template: "pub mod {{snakeCase resource_name}};",
        type: "append",
      },
      {
        path: "web-htmx/src/lib.rs",
        pattern: /(\/\/##PLOP USE RESOURCE HOOK##)/g,
        template:
          "$1\nuse resources::{{snakeCase resource_name}}::{{snakeCase resource_name}}_routes;",
        type: "modify",
      },
      {
        path: "web-htmx/src/lib.rs",
        pattern: /(\/\/##PLOP MERGE ROUTE HOOK##)/g,
        template: "$1\n.merge({{snakeCase resource_name}}_routes(state.clone()))",
        type: "modify",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub const {{constantCase resource_name}}: &str = todo!(\"Add route here\");",
        type: "append",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub fn {{snakeCase resource_name}}() -> String { todo!(\"Return hydrated route here\") }",
        type: "append",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub const {{constantCase resource_name}}_CREATE_FORM: &str = todo!(\"Add route here\");",
        type: "append",
      },
      {
        path: "web-htmx/src/routes.rs",
        template: "pub fn {{snakeCase resource_name}}_create_form() -> String { todo!(\"Return hydrated route here\") }",
        type: "append",
      },
    ],
  });

  plop.setGenerator("service-command", {
    description: "Create a command for a service",
    prompts: [
      {
        type: "input",
        name: "service_name",
        message: "Service name: ",
      },
      {
        type: "input",
        name: "command_name",
        message: "Command (usecase) name: ",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination:
          "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src",
        templateFiles: "plop-templates/service-command/*.hbs",
        base: "plop-templates/service-command",
      },
      {
        path: "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/lib.rs",
        template: "pub mod {{snakeCase command_name}};",
        type: "append",
      },
      {
        path: "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/service.rs",
        pattern: /(\/\/##PLOP INSERT COMMAND IMPORTS HOOK##)/g,
        template: `$1
    {{snakeCase command_name}}::{
      {{pascalCase command_name}}, {{pascalCase command_name}}Input, {{pascalCase command_name}}Output, 
    },`,
        type: "modify",
      },
      {
        path: "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/service.rs",
        pattern: /(\/\/##PLOP INSERT COMMAND HOOK##)/g,
        template: `$1
    pub {{snakeCase command_name}}: {{pascalCase command_name}},`,
        type: "modify",
      },
      {
        path: "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/service.rs",
        pattern: /(\/\/##PLOP INSERT COMMAND INSTANTIATION HOOK##)/g,
        template: `$1
            {{snakeCase command_name}}: {{pascalCase command_name}} {
              // Add any dependencies for the command here. They should be passed into this function and supplied by main.rs.
            },`,
        type: "modify",
      },
      {
        path: "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/service.rs",
        pattern: /(\/\/##PLOP INSERT DELEGATE HOOK##)/g,
        template: `$1
    pub async fn {{snakeCase command_name}}(
        &self,
        input: {{pascalCase command_name}}Input,
    ) -> {{pascalCase command_name}}Output {
        self.{{snakeCase command_name}}.{{snakeCase command_name}}(input).await
    }
`,
        type: "modify",
      },
    ],
  });
  plop.setGenerator("service-skeleton", {
    description: "Create the skeleton of a new service",
    prompts: [
      {
        type: "input",
        name: "service_name",
        message: "Service name: ",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: "./",
        templateFiles: "plop-templates/service-skeleton/**",
        base: "plop-templates/service-skeleton",
      },
      {
        path: "Cargo.toml",
        pattern: /(##PLOP NEW PACKAGE HOOK##)/g,
        template: `$1
          "{{kabobCase service_name}}/{{kabobCase service_name}}-service",`,
        type: "modify",
      },
    ],
  });
  plop.setGenerator("service-repository", {
    description: "Create a repository for a service",
    prompts: [
      {
        type: "input",
        name: "service_name",
        message: "Service name: ",
      },
      {
        type: "input",
        name: "aggregate_name",
        message: "Aggregate name: ",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination:
          "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/",
        templateFiles: "plop-templates/service-repository/ports/**",
        base: "plop-templates/service-repository",
      },
      {
        path: "{{kabobCase service_name}}/{{kabobCase service_name}}-service/src/ports.rs",
        template: "pub mod {{snakeCase aggregate_name}}_repository;",
        type: "append",
      },
      {
        type: "addMany",
        destination: "{{kabobCase service_name}}/",
        templateFiles: "plop-templates/service-repository/adapters/**",
        base: "plop-templates/service-repository",
      },
      {
        path: "Cargo.toml",
        pattern: /(##PLOP NEW PACKAGE HOOK##)/g,
        template: `$1
          "{{kabobCase service_name}}/adapters/in-memory-{{kabobCase aggregate_name}}-repository",`,
        type: "modify",
      },
      {
        path: "Cargo.toml",
        pattern: /(##PLOP NEW PACKAGE HOOK##)/g,
        template: `$1
          "{{kabobCase service_name}}/adapters/diesel-{{kabobCase aggregate_name}}-repository",`,
        type: "modify",
      },
    ],
  });
};
