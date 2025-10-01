---
id: task-0003
title: "Use Zod 4 for validation, composition and type-safety"
status: To Do
assignee: []
created_date: "2025-08-24 01:06"
updated_date: "2025-08-24 01:54"
labels: []
dependencies: []
priority: medium
---

## Description

Instead of generating plain TypeScript interfaces, code-gen should target Zod 4.
For business logic and _interpreters_ use
[Composable Functions](https://github.com/seasonedcc/composable-functions) or
the new [Zod 4.1 Codecs](https://colinhacks.com/essays/introducing-zod-codecs).
Presentation logic should probably do the same.
