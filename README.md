# retell-custom-llm-node-demo

This backend repo demonstrates how to start a WebSocket server that Retell server will connect to. Retell will send
live transcripts and other updates to the server, and get responses from this server. see [API Docs](https://docs.retellai.com/guide/custom-llm-websocket) for walkthrough.

The protocol of messages we send and expect to receive is documented [here](https://docs.retellai.com/api-references/llm-websocket).

To set up inbound, make phone calls, see [API Docs](https://docs.retellai.com/guide/phone-setup) for a walkthrough.

This repo contains `azure OpenAI`, `OpenAI`, and [`OpenRouter`](https://openrouter.ai), modify the import inside `src/server.ts` to switch between which one to use.

Check this [Youtube Tutorial](https://youtu.be/Tz969io9cPc?feature=shared&t=344) containing a walkthrough using the [Frontend Demo](https://github.com/adam-team/retell-frontend-reactjs-demo/tree/client_sdk) and this repo.

## Steps to run locally to test

1. Add Retell and your LLM API key (Azure OpenAI / OpenAI / OpenRouter) to ".env.development".

   - Azure OpenAI is pretty fast and stable: [guide for setup](https://docs.retellai.com/guide/azure-open-ai)
   - OpenAI is the most widely used one, although the latency can vary.
   - OpenRouter allows you to choose between tons of Open Source AI Models.

2. Install dependencies

```bash
npm install
```

3. In another bash, use ngrok to expose this port to the public network

```bash
ngrok http 8080
```

4. Start the server

```bash
npm run dev
```

You should see a fowarding address like
`https://dc14-2601-645-c57f-8670-9986-5662-2c9a-adbd.ngrok-free.app`, and you
are going to take the hostname `dc14-2601-645-c57f-8670-9986-5662-2c9a-adbd.ngrok-free.app`, prepend it with `wss://`, postpend with
`/llm-websocket` (the route setup to handle LLM websocket connection in the code) to create the url to use in the [dashboard](https://beta.retellai.com/dashboard) to create a new agent. Now
the agent you created should connect with your localhost.

The custom LLM URL would look like
`wss://dc14-2601-645-c57f-8670-9986-5662-2c9a-adbd.ngrok-free.app/llm-websocket`

## Run in prod

To run in prod, you probably want to customize your LLM solution, host the code
in a cloud, and use that IP to create the agent.
