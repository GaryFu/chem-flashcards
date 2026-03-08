# ADDED Requirements

## Requirement: Flashcard Review Session

The system must allow the user to review due flashcards and rate their difficulty to schedule future reviews.

### Scenario: Rating a card updates its next review date

- **WHEN** the user is viewing the back (answer) of a flipped flashcard
- **AND** the user clicks a rating button (Again, Hard, Good, Easy)
- **THEN** the system calculates the new interval and next review date based on the SM-2 algorithm
- **AND** the system saves the updated card data to IndexedDB
- **AND** the system shows the next due card in the queue or a completion screen if all due cards are reviewed
