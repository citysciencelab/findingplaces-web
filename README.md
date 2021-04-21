# FindingPlaces
Finding Places was a cooperation project of the HafenCity University and the City of Hamburg. In the period from May 26thto July 15th2016 the people of Hamburg were – in numerous participatory workshops with FindingPlaces CityScopes – searching for public areas suitable for the construction of accommodation for refugees. The task: to find areas which allow the accommodation of 20,000 refugees in total.

![FindingPLaces Intro Video](https://drive.google.com/uc?export=view&id=1nC_K1aOcy_JmPSLgZM0zLR7ngADG6-uv)

The project aimed to encourage a city-wide dialogue on how and where to find accommodation for a large group of refugees arriving in Hamburg. At the same time, it showcased the complexity of planning processes and thus helped develop an increased acceptance within the civil society. This led to a rewarding combination of the participants’ local knowledge and the expertise of the authorities and science. The participatory workshops not only led to the discussion of specific locations, but rather encouraged a discourse in the context of different interests (living / industry / maintenance) and legal planning requirements.  

[Project Website (in German)](https://findingplaces.hamburg/)

[Results brochure (in English)](https://repos.hcu-hamburg.de/handle/hcu/488)

[Publication: Finding Places: HCI Platform for Public Participation in Refugees’ Accommodation Process](https://www.researchgate.net/publication/319445941_Finding_Places_HCI_Platform_for_Public_Participation_in_Refugees%27_Accommodation_Process)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.

## Installing

```
cd client
npm install
```

## Configuration

Copy the configuration template from `src/app/config-dist.json` to `src/app/config.json` and adjust it to your needs.

## Development server

Run `ng serve --aot` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --aot --locale de-DE --i18nFile src/locale/messages.de-DE.xlf` for a localized version. Add the `--host 0.0.0.0` parameter if you want to access the app from another computer in the network.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## config
* ows query (url+typename) in src\app\screen\flurstueck-monitor\flurstueck-monitor.component.ts getFlurstueck
* ows query (url+typename) in src\app\screen\flurstueck-monitor\flurstueck-monitor.component.ts getComments
* geoserver layers and typenames in src\app\config.json
* urls in src\environments\environment.ts and src\environments\environment.prod.ts
* websocket topic prefix in src\environments\environment.ts and src\environments\environment.prod.ts
