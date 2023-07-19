## Require
- node js v18.16.0

## How to run

### Run development
- `yarn start`
- It will run on port `3000`
- Check the API docs on `/doc`

### Run Unit Test
`yarn unit:test`


### Project


|-----------------------|      Request       |-----------|                    |-------------------|
| Mysic App (Swift App) | -----------------> | Mysic API | -----------------> | Audio Jax Whisper |
|-----------------------| <----------------- |-----------|\                   |-------------------|
                               Response           |        \                           |
                             Youtube Data         |         \ Callback to Mysic API    |
                                                  |          \ Save to DB              |
                                                  |           \------< Background Task |
                                                  |                                    |
                                                  |                                    |
                                                  |                                    |
                                                  V                                    V
                                    Fetch and Extract Youtube Data           Detect and Generate Lyrics
                                                                                 Using OpenAI Whisper