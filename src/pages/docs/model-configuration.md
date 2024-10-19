# Customize LLM Behavior in 1 Minute

Chatemo allows you to fine-tune the behavior of your default Language Model (LLM) to suit your specific needs. To customize these settings, click the **gear icon** at the bottom of the left sidebar and navigate to the **Model Setting** tab. Here, you'll find a set of parameters that influence how the LLM behaves. Some parameters may not be applicable to certain models, so advanced users may want to refer to this document for further clarification.

![Model](/docs/model-1.png)

## Parameters

![Model Params](/docs/model-2.png)

### Default Model

- **Description**: Choose the default model from the available options based on your API keys. This model will be used every time you log in to Chatemo.
- **Behavior**: When you switch models in direct conversations or channels, Chatemo will remember your choice for that specific channel, even if you switch to other chat contexts. However, if you set a default model in an agent's configuration, that model will override the one chosen in chat contexts.
- **Recommendation**: If you don't have a specific preference, we recommend leaving the default model unset to allow flexibility in different contexts.

### Maximum Channel History

- **Description**: This parameter defines how many previous messages are included as context when making LLM API calls.
- **Behavior**: A higher number means the model will have more context from the conversation, potentially improving its responses. However, more context also means more tokens are used, which can increase the cost of API calls.
- **Recommendation**: Balance performance and cost by adjusting this value based on how much context you need the model to remember.
- **Special Consideration**: Claude supports a conversation history format known as "UAUAUA," where "U" represents user messages and "A" represents assistant (LLM) responses. Due to this structure, only the messages directly replied to by the assistant (LLM) are considered from the conversation history. For optimal performance with Claude models, you may need to set a relatively larger message history limit.

### Maximum Tokens

- **Description**: Defines the maximum number of tokens (words, punctuation, etc.) that the model can generate in a single response.
- **Behavior**: A higher token limit allows for longer responses, but also increases the cost of API calls. If the token limit is too low, the model may cut off mid-response.
- **Recommendation**: Set this value based on the length of responses you expect. For shorter interactions, a lower token limit is sufficient, while longer, more detailed responses may require a higher limit.
- **Availability**: OpenAI, Anthropic (maximum around 8000), Google

### Temperature

- **Description**: Controls the randomness of the model's responses. A lower temperature (closer to 0) makes the model more deterministic, meaning it will choose the most likely response. A higher temperature (closer to 2) makes the model more creative and varied in its responses.
- **Behavior**:
  - **Low Temperature (e.g., 0.2)**: The model will generate more predictable and focused responses.
  - **High Temperature (e.g., 1.6)**: The model will produce more diverse and creative responses, but they may be less consistent.
- **Recommendation**: Use a lower temperature for tasks requiring precision (e.g., technical writing) and a higher temperature for creative tasks (e.g., brainstorming).
- **Availability**: OpenAI, Anthropic (scaled to (0, 1)), Google

### Top P (Nucleus Sampling)

- **Description**: Controls the diversity of the model's responses by considering only the top percentage of probability mass when generating each token.
- **Behavior**:
  - **Top P > 0.5**: The model considers all possible outcomes (default behavior).
  - **Top P < 0.5**: The model will only consider the most likely outcomes, leading to more focused responses.
- **Recommendation**: Use a lower Top P (e.g., 0.3) for more deterministic responses, and a higher Top P for more diverse outputs.
- **Availability**: OpenAI, Anthropic (scaled to (0, 2)), Google

### Frequency Penalty

- **Description**: Penalizes the model for using words that have already appeared in the conversation, reducing repetition.
- **Behavior**:
  - **Higher Frequency Penalty**: The model will avoid repeating the same words or phrases.
  - **Lower Frequency Penalty**: The model may repeat words more often, which can be useful in certain contexts.
- **Recommendation**: Increase the frequency penalty if you want to reduce redundancy in the model's responses.
- **Availability**: OpenAI, Anthropic

### Presence Penalty

- **Description**: Encourages the model to introduce new topics by penalizing it for sticking to the same words or concepts.
- **Behavior**:
  - **Higher Presence Penalty**: The model will be more likely to explore new topics and ideas.
  - **Lower Presence Penalty**: The model will stick more closely to the current topic.
- **Recommendation**: Use a higher presence penalty for creative tasks where you want the model to introduce new ideas, and a lower penalty for tasks that require staying on topic.
- **Availability**: OpenAI, Anthropic
