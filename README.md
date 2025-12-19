# ChatGPT Usage Profile

A dynamic, interactive web application that visualizes your ChatGPT usage patterns and experience level for a given year.

Input JSON data about your interactions, and the app renders an profile with your archetype and personalized tips for improvement.

## Features

- **Archetype-based Profile**: Display your AI usage style with an elegant "personal dedication" layout.
- **Word Cloud Visualization**: Interactive word cloud showing your main interaction types with weighted importance.
- **Experience Level Scale**: 10-block visual scale to rate your proficiency with AI (0–10).
- **Categorized Tips**: Tips grouped by category (Prompting, API usage, Model Capabilities, etc.) for easy browsing.
- **JSON Input Form**: Paste or load custom JSON data directly in the app to see your profile update in real-time.
- **Example Prompts**: Separate page with ChatGPT prompts you can copy and use to generate your own profile JSON.
- **Responsive Design**: Built with Bootstrap for mobile-friendly viewing.

## JSON Data Format

The app expects data in this structure:

```json
{
    "header": {
        "year": 2025,
        "outputLanguage": "ENGLISH"
    },
    "archetype": {
        "name": "Creative Coder",
        "summary": "A developer who uses AI for brainstorming, rapid prototyping, and debugging..."
    },
    "interactionTypes": [
        {"word": "brainstorming", "weight": 10},
        {"word": "coding", "weight": 9},
        ...
    ],
    "userLevel": {
        "value": 8,
        "reason": "Demonstrates consistent use with well-formed prompts..."
    },
    "tips": [
        {
            "category": "Prompting",
            "text": "Practice crafting clearer, more specific prompts."
        },
        ...
    ]
}
```

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd my-chatgpt-profile
   ```

2. **Open in browser**:
   
   - Serve locally: `python3 -m http.server 8000` then navigate to `http://localhost:8000/main/`

3. **No build step needed** — this is a static site with deferred script loading.

## Usage

1. Open `main/index.html` in your browser.
1. Goto `example prompts`
2. Copy the example prompt and paste it into ChatGPT.
3. Ask ChatGPT to describe your usage (optionally provide context about how you use AI).
4. ChatGPT returns JSON matching the required structure.
5. Copy the JSON output.
6. Return to `index.html`, paste your JSON, and click **"Apply JSON"**.

## License

This project is licensed under the GPLv3 License. See the LICENSE file for details.