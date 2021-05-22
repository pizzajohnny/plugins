## adultempire 0.4.2

by boi123212321

Scrape data from adultempire

### Download links
Each download link is the latest version of the plugin for the indicated porn-vault server version:  
| Server version                                                                            |
| ----------------------------------------------------------------------------------------- |
| [stable](https://raw.githubusercontent.com/porn-vault/plugins/master/dist/adultempire.js) |
| [0.27](https://raw.githubusercontent.com/porn-vault/plugins/0.27/dist/adultempire.js)     |


### Arguments

| Name | Type    | Required | Description                    |
| ---- | ------- | -------- | ------------------------------ |
| dry  | Boolean | false    | Whether to commit data changes |

### Example installation with default arguments

`config.json`

```json
---
{
  "plugins": {
    "register": {
      "adultempire": {
        "path": "./plugins/adultempire.js",
        "args": {
          "dry": false
        }
      }
    },
    "events": {
      "movieCreated": [
        "adultempire"
      ],
      "actorCreated": [
        "adultempire"
      ]
    }
  }
}
---
```

`config.yaml`

```yaml
---
plugins:
  register:
    adultempire:
      path: ./plugins/adultempire.js
      args:
        dry: false
  events:
    movieCreated:
      - adultempire
    actorCreated:
      - adultempire

---

```
