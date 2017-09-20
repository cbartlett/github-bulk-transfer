# Github Bulk Transfer! [![License][license-image]][license-url]

> Simple CLI utility to trigger bulk transfers of github repos through a headless browser

## Usage

1. Fork/clone this repo
2. add a `repositories.json` with an array of repos names to process _(see [example](#example) below)_
3. run the CLI utility `index.js` with the following options.

```
Options:
  --version   Show version number                                      [boolean]
  --email     email                                                   [required]
  --password  password                                                [required]
  --token     2FA token                                               [required]
  --old       old repo owner                                          [required]
  --new       new repo owner                                          [required]
  --help      Show help                                                [boolean]

Missing required arguments: email, password, token, old, new
```

###### Example

```json
[
  "my-repository-name",
  "my-other-repository-name"
]
```

```bash
$ node index.js --old ahmadnassri --new ahmadnassri-archive --email name@domain.com --password foobar --token 123456
```

---
> :copyright: [www.ahmadnassri.com](https://www.ahmadnassri.com/)  · 
> License: [ISC][license-url]  · 
> Github: [@ahmadnassri](https://github.com/ahmadnassri)  · 
> Twitter: [@ahmadnassri](https://twitter.com/ahmadnassri)

[license-url]: http://choosealicense.com/licenses/isc/
[license-image]: https://img.shields.io/github/license/ahmadnassri/clickit.svg?style=flat-square
