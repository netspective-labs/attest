---
id: task-0004
title: Experiment with R4 Questionnaire as Wizard definition
status: To Do
assignee: []
created_date: '2025-08-24 01:58'
updated_date: '2025-08-24 02:00'
labels: []
dependencies: []
priority: high
---

## Description

To help isolate the definition of multi-form wizards, create an R4 Questionnaire template that would include all the meta data necessary. Then, a generator would create Zod-based type-safe classes for navigating and maintaining state for the wizards.

The primary benefit of this design would be to allow non-developers to maintain wizards. If developers will always maintain the wizard it's probably not worth it?
