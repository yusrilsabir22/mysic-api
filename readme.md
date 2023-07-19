## Require
- node js v18.16.0

## How to run

### Run development
- `yarn start`
- It will run on port `3000`
- Check the API docs on `/doc`

### Run Unit Test
`yarn unit:test`

### DB Migration
Available commands:
- `show-migration`
- `up-migration`
- `gen-migration`

`gen-migration` required `args` as migration name
example:
```
./manage gen-migration migration-name
```


### Project Reference

[Mysic API](https://github.com/yusrilsabir22/mysic-api)

[Mysic App (Swift App)](https://github.com/yusrilsabir22/MysicApp)

[Audio Jax Whisper](https://github.com/yusrilsabir22/audio_jax_whisper)

```
|-------------------------|
|- Mysic App (Swift App) -|
|-------------------------|
        |
        |
        V
|-----------|
| Mysic API | --------------- Fetch and Extract Youtube Data
|-----------|______________
        |                  \ Callback to Mysic API and save to DB
        |                   \
        |                    \
        V                     \ 
|-------------------|          \ 
| Audio Jax Whisper | -------- Detect and Generate Lyrics
|-------------------|               (Background Task)
```