# Create a New Agent in 1 Minute

Agents are your customizable AI assistants, designed to remember your specific instructions and preferred model behaviors. For instance, you could create a "Markdown Master" agent that always responds in Markdown format and polishes your writing according to your custom style. Let's dive in and see how easy it is to set up your own agent!

## Naming Your Agent

Creating your first agent is a breeze:

1. Navigate to the agent tab in the sidebar to view your agent list.
2. To create a new agent, either:
   - Click the plus button in the sidebar, or
   - Click the plus button near your avatar at the bottom.

![New agent](/docs/agent-1.png)

3. Give your agent a name and a brief description. Feel free to upload a custom avatar image, or let Chatemo use a default one for you.

![Name agent](/docs/agent-2.png)

4. Click 'Create', and voila! Your agent is ready to go.

## Customizing with Prompts

System prompts are the secret sauce to tailoring your agent's behavior. Simply type in your requests to shape how your agent acts. These prompts will guide all Language Models (LLMs) when you call upon your agent.

For example, typing "You should play a role as a creative SaaS designer full of new ideas" will focus your agent on SaaS design tasks.

You can add multiple prompts and edit them anytime. If a prompt isn't working well, just hover over it and click the trash-icon to remove it. We recommend combining related prompts if you find yourself with too many.

![Agent Prompt](/docs/agent-3.png)

Once set up, your agent will be available in all your joined channels. To use them, hover over a message and click the agent button.

![Agent in Channel](/docs/agent-7.png)

## Fine-tuning Your Agent

### Updating Agent Information

Need to tweak your agent's details? Just click the edit-icon button at the top right of the chat window. You'll see an editor like this:

![Edit agent information](/docs/agent-4.png)

### Choosing a Default Model

Agents aren't tied to any specific LLM by default, giving you the flexibility to switch between models in different contexts (preview mode, channels, or direct messages). This feature lets you experiment with various agent-model combinations to find the perfect fit for each task.

If you haven't found the ideal model for your specific needs, we suggest leaving the default model unspecified. When set, the default model overrides the model chosen in channels and friend conversations. You can always remove the default model by clicking the cross button near the selector.

![Default Model](/docs/agent-5.png)

### Tweaking Model Parameters

Model parameters fine-tune the LLM's behavior during API calls. Most parameters in Chatemo work across all models, but some might be ignored if not supported by a particular LLM provider. Feel free to experiment!

You can adjust these settings by scrolling down the agent information form. The default values are based on your user default model configuration when you create the agent. Changes to your default model won't affect existing agents.

For more details on these parameters, hover over the question icon or check out our [Default Model Configuration](model-configuration) guide.

## Preview Mode: Test Drive Your Agent

Once you've set up your agent's prompts and parameters, you'll want to see it in action before deploying it to channels. That's where preview mode comes in handy!

To access preview mode, click the rocket icon button at the top of your editor. This opens a preview window, simulating a chat session similar to interacting with ChatGPT.

![Agent Preview](/docs/agent-preview.png)

In preview mode:

- Your inputs are direct communications with the chosen model, not prompts.
- Responses are generated in real-time, word by word.
- You can switch between models on the fly to compare performance and find your ideal match.

Remember, preview sessions are for testing only and aren't stored. If you need to keep a record of your interactions, use the agent in a channel instead.

## Removing an Agent

If you need to delete an agent, it's simple:

1. Right-click (or double-click on Mac) the agent in the sidebar.
2. Select 'Remove' from the menu that appears.

![Delete agent](/docs/agent-8.png)

And that's it! You're now ready to create, customize, and manage your own AI agents in Chatemo. Happy chatting!
