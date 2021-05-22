## resolution 0.0.2

by boi123212321

Add resolution labels to a scene

### Download links
Each download link is the latest version of the plugin for the indicated porn-vault server version:  
| Server version                                                                           |
| ---------------------------------------------------------------------------------------- |
| [stable](https://raw.githubusercontent.com/porn-vault/plugins/master/dist/resolution.js) |
| [0.27](https://raw.githubusercontent.com/porn-vault/plugins/0.27/dist/resolution.js)     |


### Arguments

| Name        | Type     | Required | Description                                                                                         |
| ----------- | -------- | -------- | --------------------------------------------------------------------------------------------------- |
| resolutions | number[] | false    | Resolutions to match against the scene's path, when the scene's metadata has not yet been extracted |

### Example installation with default arguments

`config.json`

```json
---
{
  "plugins": {
    "register": {
      "resolution": {
        "path": "./plugins/resolution.js",
        "args": {
          "resolutions": []
        }
      }
    },
    "events": {
      "sceneCreated": [
        "resolution"
      ],
      "sceneCustom": [
        "resolution"
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
    resolution:
      path: ./plugins/resolution.js
      args:
        resolutions: []
  events:
    sceneCreated:
      - resolution
    sceneCustom:
      - resolution

---

```
