---
name: Bug Report
about: Create a report to help us improve the game
title: '[BUG] '
labels: bug
assignees: ''
---

## Bug Description

A clear and concise description of what the bug is.

## Game

Which game is affected?

- [ ] Blackjack
- [ ] Uno
- [ ] Other: ****\_\_\_****

## Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

A clear and concise description of what you expected to happen.

## Actual Behavior

A clear and concise description of what actually happened.

## Screenshots

If applicable, add screenshots to help explain your problem.

## Environment

- **Browser:** [e.g. Chrome, Safari, Firefox]
- **Version:** [e.g. 22]
- **Device:** [e.g. Desktop, Mobile, Tablet]
- **OS:** [e.g. iOS, Windows, macOS, Android]
- **Screen Resolution:** [e.g. 1920x1080]

## Game State (if applicable)

- **Player Hand:** [describe cards in hand]
- **Computer Hand:** [if visible]
- **Current Turn:** [Player/Computer]
- **Game Phase:** [Deal/Playing/Game Over]

## Console Errors

If you see any errors in the browser console, please paste them here:

```
[Paste console errors here]
```

## Additional Context

Add any other context about the problem here.

## Severity

- [ ] Critical (Game breaking, cannot play)
- [ ] High (Major feature not working)
- [ ] Medium (Minor feature issue)
- [ ] Low (Cosmetic issue)

````

## Feature Request Template

```markdown:/.github/ISSUE_TEMPLATE/feature_request.md
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Feature Summary
A clear and concise description of what you want to happen.

## Game
Which game would this feature affect?
- [ ] Blackjack
- [ ] Uno
- [ ] New Game
- [ ] General/UI
- [ ] Other: ___________

## Problem Statement
Is your feature request related to a problem? Please describe.
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

## Proposed Solution
Describe the solution you'd like.
A clear and concise description of what you want to happen.

## Alternative Solutions
Describe alternatives you've considered.
A clear and concise description of any alternative solutions or features you've considered.

## User Stories
As a [type of user], I want [goal] so that [benefit].

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Mockups/Examples
If applicable, add mockups, sketches, or examples from other games/apps.

## Technical Considerations
Any technical details or constraints to consider:
- Performance impact
- Browser compatibility
- Mobile responsiveness
- Accessibility

## Priority
- [ ] Must Have
- [ ] Should Have
- [ ] Could Have
- [ ] Won't Have (this time)

## Additional Context
Add any other context or screenshots about the feature request here.
````

## Game Enhancement Template

```markdown:/.github/ISSUE_TEMPLATE/game_enhancement.md
---
name: Game Enhancement
about: Suggest improvements to existing game mechanics
title: '[GAME] '
labels: game-enhancement
assignees: ''
---

## Game
- [ ] Blackjack
- [ ] Uno

## Enhancement Type
- [ ] Game Rules/Logic
- [ ] AI Improvement
- [ ] User Interface
- [ ] Game Balance
- [ ] Performance
- [ ] Accessibility

## Current Behavior
Describe how the game currently works in this area.

## Proposed Enhancement
Describe your suggested improvement.

## Benefits
- Improved user experience because...
- Better game balance because...
- More realistic gameplay because...

## Implementation Ideas
If you have technical suggestions:
- Component changes needed
- Logic modifications
- New functions/methods

## Examples
Reference other card games or implementations if applicable.

## Testing Scenarios
How should this enhancement be tested?
- [ ] Scenario 1
- [ ] Scenario 2
- [ ] Scenario 3

## Additional Notes
Any other relevant information.
```

## New Game Request Template

```markdown:/.github/ISSUE_TEMPLATE/new_game.md
---
name: New Game Request
about: Request a new card game to be added
title: '[NEW GAME] '
labels: new-game
assignees: ''
---

## Game Name
What card game would you like to see added?

## Game Description
Brief description of the game and its rules.

## Game Complexity
- [ ] Simple (like War)
- [ ] Medium (like Blackjack)
- [ ] Complex (like Uno)
- [ ] Very Complex (like Bridge)

## Player Count
- Minimum players: ___
- Maximum players: ___
- Optimal players: ___

## Game Components Needed
- [ ] Standard 52-card deck
- [ ] Uno-style deck
- [ ] Custom deck
- [ ] Special cards
- [ ] Scoring system
- [ ] Timer
- [ ] Other: ___________

## Key Features
- [ ] Single player vs computer
- [ ] Multiplayer support needed
- [ ] Special animations
- [ ] Sound effects
- [ ] Custom rules/variants

## Similar Games
List any similar games already in the project or other references.

## Priority/Interest Level
How much would you like to see this game added?
- [ ] High - Would use frequently
- [ ] Medium - Would try it out
- [ ] Low - Just a suggestion

## Additional Resources
Links to rules, examples, or other helpful resources:
- Rules: [URL]
- Examples: [URL]
- Videos: [URL]

## Implementation Notes
Any technical considerations or suggestions for implementation.
```

## General Issue Template

```markdown:/.github/ISSUE_TEMPLATE/general.md
---
name: General Issue
about: General questions, discussions, or other issues
title: ''
labels: question
assignees: ''
---

## Issue Type
- [ ] Question
- [ ] Discussion
- [ ] Documentation
- [ ] Setup/Installation
- [ ] Other

## Description
Describe your issue, question, or topic for discussion.

## Context
Provide any relevant context or background information.

## Expected Outcome
What are you hoping to achieve or learn?

## Additional Information
Any other relevant details.
```

## Configuration File

```yaml:/.github/ISSUE_TEMPLATE/config.yml
blank_issues_enabled: false
contact_links:
  - name: 💬 Discussions
    url: https://github.com/mcpeakdb/mcpeakdbhub.io/discussions
    about: Ask questions and discuss ideas with the community
  - name: 📚 Documentation
    url: https://github.com/mcpeakdb/mcpeakdbhub.io/wiki
    about: Check the project documentation and guides
```

## Labels to Create

Create these labels in your GitHub repository:

```bash
# Bug related
bug
critical
high-priority
needs-reproduction

# Features
enhancement
feature-request
game-enhancement
new-game

# Games
blackjack
uno
general-ui

# Status
in-progress
needs-review
ready-for-testing
wont-fix
duplicate

# Type
question
documentation
good-first-issue
help-wanted

# Platform
mobile
desktop
browser-specific
```
