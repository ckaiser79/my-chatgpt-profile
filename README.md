# ChatGPT Usage Profile

A Javascript web application that visualizes your ChatGPT usage patterns and experience level for a given year.

Input JSON data about your interactions, and the app renders an profile with your archetype and personalized tips for improvement.

![Example Rendering](doc/sample-result.png)

## Features

- **Archetype-based Profile**: Display your AI usage style with an elegant "personal dedication" layout.
- **Experience Level Scale**: 10-block visual scale to rate your proficiency with AI (0–10).
- **Categorized Tips**: Tips grouped by category (Prompting, API usage, Model Capabilities, etc.) for easy browsing.
- **JSON Input Form**: Paste or load custom JSON data directly in the app to see your profile update in real-time.

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

## Build & Deploy

### Available Make Targets

- **`make package`** - Builds the project into the `target/` directory
- **`make clean`** - Removes the build artifacts
- **`make deploy_local`** - Deploys to local web server (requires sudo)
- **`make deploy_production`** - Deploys to production server via rsync
- **`make debug_production`** - Shows production configuration and tests SSH connection

### Configuration

Create a `local.config` file (copy from `local.example.config`) to configure deployment:

```makefile
deploy_local_target_dir = /usr/local/var/www/my-chatgpt-profile
production_directory = /path/to/production
prodction_ssh_host = ssh.example.com
prodction_ssh_user = username
prodction_ssh_key = /path/to/ssh/key
```

**Note:** `local.config` is gitignored to keep credentials secure.

## Usage

1. Open `index.html` in your browser.
1. Copy the prompt and paste it into ChatGPT.
3. Ask ChatGPT to describe your usage. Maybe it is nice for you, to see you in a specific role, just add this to the prompt.
4. ChatGPT returns JSON matching the required structure.
5. Copy the JSON output.
6. Return to `index.html`, paste your JSON, and click **Apply**.
7. Your result is on Step 4.

## License

This project is licensed under the GPLv3 License. See the [LICENSE](LICENSE) file for details.


## Hints

This is my first vibe coding trial. So do not judge code quality ;-)