## label_filter 0.0.2

by boi123212321

Filter labels returned by other plugins

### Download links
Each download link is the latest version of the plugin for the indicated porn-vault server version:  
| Server version                                                                             |
| ------------------------------------------------------------------------------------------ |
| [stable](https://raw.githubusercontent.com/porn-vault/plugins/master/dist/label_filter.js) |
| [0.27](https://raw.githubusercontent.com/porn-vault/plugins/0.27/dist/label_filter.js)     |


### Arguments

| Name      | Type     | Required | Description       |
| --------- | -------- | -------- | ----------------- |
| whitelist | String[] | false    | Labels to include |
| blacklist | String[] | false    | Labels to exclude |

### Example installation with default arguments

`config.json`

```json
---
{
  "plugins": {
    "register": {
      "label_filter": {
        "path": "./plugins/label_filter.js",
        "args": {
          "whitelist": [],
          "blacklist": []
        }
      }
    },
    "events": {
      "actorCreated": [
        "label_filter"
      ],
      "actorCustom": [
        "label_filter"
      ],
      "sceneCreated": [
        "label_filter"
      ],
      "sceneCustom": [
        "label_filter"
      ],
      "studioCreated": [
        "label_filter"
      ],
      "studioCustom": [
        "label_filter"
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
    label_filter:
      path: ./plugins/label_filter.js
      args:
        whitelist: []
        blacklist: []
  events:
    actorCreated:
      - label_filter
    actorCustom:
      - label_filter
    sceneCreated:
      - label_filter
    sceneCustom:
      - label_filter
    studioCreated:
      - label_filter
    studioCustom:
      - label_filter

---

```
