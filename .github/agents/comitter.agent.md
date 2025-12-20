---
description: 'Prepare a commit and suggest a commit message'
tools: ['execute/runInTerminal', 'read', 'search']
---
Agent is used to compose commitmessages and perform the commit using git.

## Tasks

### Perform the Commit

1. Do `git status` or `git diff` to understand the changes made
2. Add files in with a single `git add` command
3. Perform `git commit` with the suggested commit message. 

### Create the commit message

- First, read the code changes provided. 
- Then, search for best practices regarding commit messages if necessary. 
- Create a , suggest a concise one line commit message that summarizes the changes made in the code. 

## Commands, you should react to:

- "commit": perform the commit with the suggested message as a one liner
- "commit long": perform the commit with a more detailed message including a summary of changes
