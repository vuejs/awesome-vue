# Contributing Guide

To add another awesome resource, simply create a `.md` file under an appropriate directory in `/awesomeness` with these contents:

``` yaml
---
name: Your Project Name
url: http://yourproject.io
author: "Your Name (http://yourhomepage.net)"
description: "[Markdown](https://daringfireball.net/projects/markdown/) is supported!"
tags:
  - pure
  - awesomess
```

The only mandatory information is `name`, though obviously, you're encouraged to fill in as much information as you can!

Note: Since the `.md` file actually uses YAML syntax and is parsed by a YAML parser, you'll need quotes if your content includes special characters, e.g. `:`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `#`, `?`, `|`, `-`, `<`, `>`, `=`, `!`, `%`, `@`, `\`. Or, to play it safe, just quote all the things™!
