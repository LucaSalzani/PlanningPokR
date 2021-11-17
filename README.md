# PlanningPokR

Planning Poker web app with SignalR

## Backlog / Ideas

<https://trello.com/b/gZp3mXuR>

## Demo

[Go to App in Azure](https://planningpokr.azurewebsites.net/)

![PlanningPokR Demo](Docs/PlanningPokr.gif)

## Troubleshooting

- Clear the local storage in your browser
- Use a different User ID

## Local development

- Set PLANNINGPOKR_JIRAPASSWORD as environment variable in launch settings

## Deploying to Heroku

- heroku login
- heroku container:login
- heroku container:push web -a agile-refuge-02784
- heroku container:release web -a agile-refuge-02784
