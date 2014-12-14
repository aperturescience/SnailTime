RailTime API Wrapper
============

Railtime.be API wrapper, written in Node

#Available routes

|Route        |   |
|---          |---|
|/            |API version information etc.|
|/status      |The status of the api|
|/disruptions |A list of all the train disruptions|
|/stations    |A list of all the Belgian train stations|
|/stations/:id|Details of a particular station, includes train arrivals and departures|
|/stations/:id/arrivals|Details of a particular station, arrivals only|
|/stations/:id/departures|Details of a particular station, departures only|
|/routes?from=455&to=37&departure="2014-12-14 08:00:00"|Request a route from Gent-Sint-Pieters to Antwerpen-Centraal|