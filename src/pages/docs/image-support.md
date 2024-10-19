# Image Support

Chatemo supports conversations and LLM analysis with images, allowing you to share and analyze visual content alongside text. You can easily upload images by clicking the **image button** in the editor and selecting a file from your local device. Both the text and images will be sent to your friends or channels, and you can call models and agents to respond to the image message, as shown in the example below:

![Image Request](/docs/image-1.png)

## How It Works

When you send an image message, only the image in the **request message** will be used for LLM API analysis. This design choice helps to:

- **Reduce latency**: By limiting the data sent to the LLM, we ensure faster response times.
- **Lower network pressure**: Sending only the relevant image reduces the load on the server, improving overall performance.
- **Lower credits used**: Yeah, save money.

## Important Considerations

- **SDK and API Limitations**: Not all LLM providers or SDKs support image URLs as part of the input. Some providers require the image to be uploaded when the API is called.
- **Why We Don’t Use Image History**: If we were to include all images from previous messages in the API call, it would significantly increase the time it takes to get a response and put additional strain on the server. This could lead to delays and higher network usage.

### Best Practices

If you plan to use image features with LLMs, keep the following in mind:

- Only the image in the current request will be analyzed by the model.
- For optimal performance, avoid relying on images from previous messages for analysis.

By following these guidelines, you can ensure smooth and efficient use of image support in Chatemo, while keeping response times fast and network usage low.

---

Chatemo’s image support opens up new possibilities for visual communication and analysis, allowing you to enhance your conversations with images and get AI-powered insights in real-time. Happy chatting!
