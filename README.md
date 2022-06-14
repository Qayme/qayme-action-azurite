# Azurite

Starts [Azurite](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite?tabs=visual-studio) emulator in GitHub actions via Docker CLI.

## Usage
```yaml
# ...
jobs:
  <jobname>:
    steps:
      - name: Start storage emulator
        uses: qayme/qayme-action-azurite@1.0.0

# ...


```