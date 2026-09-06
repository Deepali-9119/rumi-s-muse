# ✨ Rumi's Muse — AI Poetry Assistant

A creative AI web app that transforms any topic or life situation into a short, reflective poem inspired by the contemplative and metaphorical qualities associated with Rumi.

> A simple creative experience exploring how AI can turn everyday thoughts and situations into reflective writing.

## 💡 Concept

Rumi's Muse is designed as a focused creative AI experience.

Instead of presenting users with multiple controls or complex writing options, the product keeps the interaction simple:

**Enter a topic or situation → Generate a reflective poem**

The concept explores how a conversational AI experience can be intentionally simplified to support creativity and emotional reflection.

## 🎯 User Problem

Writing poetry can feel intimidating for people who have an idea or emotion they want to express but don't know how to turn it into words.

Rumi's Muse addresses this by providing a simple starting point: users describe a topic, situation, or thought, and the AI transforms it into a short reflective poem.

## 👤 Target User

- People interested in poetry and creative writing
- Users looking for a simple creative writing prompt
- People who want to transform everyday thoughts or situations into reflective writing

## ⚙️ How It Works

The experience follows a simple request-and-response flow:

**User Input → Webhook → n8n Workflow → Gemini AI Agent → Generated Poem**

1. The user enters a topic or life situation.
2. The input is sent to the application through a webhook.
3. The n8n workflow passes the request to an AI Agent.
4. Google Gemini generates a short reflective poem.
5. The generated poem is returned to the user.

## ✨ Key Features

| Feature | Description |
|---|---|
| **Rumi-Inspired Poetry** | Generates reflective poetry inspired by contemplative and metaphorical qualities associated with Rumi |
| **Simple Interaction** | One focused input flow keeps the experience easy to understand |
| **Poetry-Formatted Output** | The AI response is structured specifically as a short poem |
| **AI Workflow Integration** | Uses an n8n workflow to connect the user experience with an AI Agent |
| **Prompt-Driven Generation** | A structured prompt guides tone, length, and output format |

## 🧠 AI Behavior

The AI Agent is guided to:

- Generate short reflective poems
- Use a warm, spiritual, and contemplative tone
- Respond in approximately 8–14 lines
- Focus directly on the user's topic or situation
- Return the poem without additional explanation or commentary

The goal is to create a consistent creative interaction while leaving enough flexibility for different user inputs.

## 🏗️ Architecture

**Frontend (Lovable Prototype) → Webhook → n8n → Gemini AI Agent → Generated Poem**

### Workflow Components

| Component | Role |
|---|---|
| **Lovable** | Frontend prototype and user experience |
| **Webhook** | Receives the user's input |
| **n8n** | Workflow orchestration |
| **AI Agent** | Processes the request and generates the poem |
| **Google Gemini** | Language model used for poem generation |
| **Respond to Webhook** | Returns the generated poem to the application |

## 🎨 Product Insight

One of the key product decisions was to keep the experience intentionally simple.

For a creative AI product, adding more controls does not necessarily improve the experience. Rumi's Muse explores how a focused interaction can reduce friction and allow the AI-generated output to remain the central part of the experience.

## 🧪 Prototype & Implementation

Rumi's Muse was developed as an AI-assisted product prototype using **Lovable**, with **n8n** used for workflow orchestration and **Google Gemini** used for AI-powered poem generation.

The project focuses on exploring the product experience, interaction flow, prompt design, and AI workflow integration rather than representing a production implementation.

## 💡 What I Learned

- **Prompt engineering:** Clear instructions help guide AI-generated content toward a consistent format and tone.
- **Webhook integration:** Connecting a frontend experience to an AI workflow requires a clear input and output flow.
- **AI workflow thinking:** Building an AI product involves designing the interaction between the user experience, workflow, and model.
- **Simplicity in UX:** A focused experience can make an AI-powered product easier to understand and use.
- **Creative AI product design:** Generative AI can be used not only for productivity but also for creative and expressive experiences.

## 👩‍💻 Built By

**Deepali Shah**

Aspiring Product Manager focused on **AI Products, Product Analytics, and practical AI-powered product experiences**.
