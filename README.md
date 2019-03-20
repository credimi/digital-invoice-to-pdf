# This module generates a PDF stream from a [🇮🇹 Digital invoice XML string input](https://www.fatturapa.gov.it/export/fatturazione/it/normativa/f-2.htm)

## TLDR

from [HERE](https://www.fatturapa.gov.it/export/fatturazione/sdi/fatturapa/v1.2/IT01234567890_FPA02.xml) to [THERE](./assets/example.pdf)

## Example inside your express request

```js
  request.get(fileUri, async (error, response, body) => {
    if (error) return 'Remember to manage Errors'

    try {
      const result = await xmlToPDF(body)
      try {
        // RES
        res.set('Content-Type', 'application/pdf')
        result.pipe(res)
      } catch (e) {
        console.log(`Error occurred while rendering: ${e}`)
        res.status(500).end()
      }
    } catch (error) {
      logger.error(error)
      res.status(500)
      res.send({ error: 'Failed to parse XML', message: error.message })
    }
  })
}
```

The module exports also:

a simple `xmlToJson` function that uses [XML2JS](https://github.com/Leonidas-from-XIV/node-xml2js) and returns a typed JSON (check the types DigitalInvoiceJson in types folder)

the function `xmlToCompactJson` that transform the previous `DigitalInvoiceJson` in a more consistent and smaller `DigitalInvoice` (check the types DigitalInvoice in types folder)
