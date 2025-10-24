# loversandfriends

A simple Node.js script where couples can input their names and build a bank of date ideas together.

## How to Run

```bash
node index.js
```

or

```bash
npm start
```

## Features

- Input your name and your partner's name
- **Add date ideas with both partners' input** - Each person provides their own idea for a date category
- View all your saved date ideas with both partners' inputs
- Delete ideas you've completed or no longer want
- Data persists between sessions (saved in `date-ideas.json`)
- Reset option to start fresh with new names

## Commands

- **`add`** - Add a date idea where both partners input their specific ideas
- **`delete [number]`** - Remove a specific date idea
- **`reset`** - Start over with new names
- **`quit` or `exit`** - Close the program

## Example

```
Date idea? Movie

Kyle, input your ideas: Watch Inception at home

Sarah, input your ideas: Go see the new romantic comedy at the theater
```