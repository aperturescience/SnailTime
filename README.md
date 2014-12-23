# 🐌 SnailTime


Railtime.be API wrapper, written in Node

## Available routes

|Route                |Description|
|---                  |---|
|/                    |API version information etc.|
|/status              |The status of the API and infrastructure|
|/disruptions         |A list of all the train disruptions|
|/stations            |A list of all the Belgian train stations|
|/stations/:id        |Details of a particular station, includes train arrivals and departures|
|/stations/:id/arrivals   |Details of a particular station, arrivals only|
|/stations/:id/departures |Details of a particular station, departures only|
|/routes          |Request a route from Gent-Sint-Pieters to Antwerpen-Centraal|

## Id's vs strings

**NOTE:**
If you are consuming this API in an automated way (through an application), we strongly suggest relying on Id's rather than strings because the Levenshtein distance algorithm used for string searching might return unexpected results.

A list of stations and their respective Id's can be found at `/stations`.

If you prefer using strings, the API supports supplying a string as the name of a station since v0.2.0.

If no matching station can be found, an exception is returned.

```javascript
{
  error: {
    code: 404,
    message: "Could not find station: foobarbaz",
    type: "StationNotFoundException"
  }
}
```

## Localisation and i18n

The language you'd like to use is specified by supplying the **Accept-Language** header in your request as defined in [RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4).

List of languages that are accepted:

- **nl, fr, de, en**

Alternatively:

- **nl-BE, fr-FR, de-DE, en-US, etc.**

Any unrecognized language will default to English.

## Getting directions

**Params**

|Name   | Description | Details |
|---|---|---|
|from   | Departure station | Could be an ID (int) or a name (string). <br> example: 455 or "gent-sint-pieters" |
|to   | Arrival station | Could be an ID (int) or a name (string). <br> example: 455 or "gent-sint-pieters" |
|departure  |Time at which you wish to leave | format: "YYYY-MM-dd HH:mm:ss" <br> example: "2014-12-14 08:00:00" |
|arrival  |Time at which you wish to arrive | format: "YYYY-MM-dd HH:mm:ss" <br> example: "2014-12-14 08:00:00" |

ie.

`/routes?from=455&to=37&departure=2014-12-14 08:00:00`

or

`/routes?from=gent-sint-pieters&to=antwerpen-centraal&departure=2014-12-14 08:00:00`
