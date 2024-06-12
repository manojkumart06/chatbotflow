# Chatbot Flow Builder

This project is a simple Chatbot Flow Builder built using React. It allows users to create a chatbot flow by connecting multiple messages together to decide the order of execution. The current version supports Text Nodes and provides a basic framework to easily add new features in the future.


## Features

1. **Text Node**
    1. Our flow builder currently supports only one type of message (i.e Text Message).
    2. There can be multiple Text Nodes in one flow.
    3. Nodes are added to the flow by dragging and dropping a Node from the Nodes Panel.

2. **Nodes Panel**
    1. This panel houses all kind of Nodes that our Flow Builder supports.
    2. Right now there is only Message Node, but we’d be adding more types of Nodes in the future so make this section extensible.

3. **Edge**
    1. Connects two Nodes together.

4. **Source Handle**
    1. Source of a connecting edge.
    2. Can only have **one edge** originating from a source handle.

5. **Target Handle**
    1. Target of a connecting edge.
    2. Can have **more than one edge** connecting to a target handle.

6. **Settings Panel**
    1. Settings Panel will replace the Nodes Panel when a Node is selected.
    2. It has a text field to edit text of the selected Text Node.

7. **Save Button**
    1. Button to save the flow.
    2. **Save button press will show an error if there are more than one Nodes and more than one Node has empty target handles.**

## Getting Started

## Prerequisites

1. Ensure you have Node.js installed on your machine. You can download it from nodejs.org.

## Installation

1. Clone the repository:
    `git clone https://github.com/manojkumart06/chatbotflow`
    `cd chatbotflow`
2. Install the dependencies:
    `npm install`
3. Running the Application:
   To start the application in development mode, run:
   `npm start`
   This will start the app on http://localhost:8000.

## Contributing
    Contributions are welcome! Please fork the repository and create a pull request with your chang

## Live Websites

- You can see a live demo of the project [here]().

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
