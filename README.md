# 🚀 LinkedIn Post Generator

An AI-powered LinkedIn post generator that creates engaging, professional posts tailored to your company and target audience. Built with Next.js, BAML, and powered by OpenAI/Anthropic AI models.

## ✨ Features

- **🎯 Targeted Content**: Generate posts specifically crafted for your company and target audience
- **📊 LinkedIn-Optimized**: Posts formatted for maximum engagement with proper hooks, content structure, and hashtags
- **🤖 AI-Powered**: Leverages multiple AI models (GPT-4o, GPT-4o-mini, Claude) for intelligent content generation
- **📱 Real-time Preview**: See how your post will look on LinkedIn before publishing
- **📋 One-Click Copy**: Easy copying to clipboard for immediate posting
- **🔄 Retry Logic**: Built-in retry mechanisms for reliable AI generation

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Material-UI (MUI)
- **AI/ML**: [BAML](https://docs.boundaryml.com/) for AI function orchestration
- **AI Models**: OpenAI (GPT-4o, GPT-4o-mini), Anthropic (Claude)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- OpenAI API key and/or Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Fulail-kt/linkedin-post-generator.git
   cd linkedin-post-generator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Basic Usage

1. **Fill in Company Details**:
   - **Company Name**: Your company's name
   - **Company Description**: Brief description of what your company does
   - **Target Audience**: Who you're trying to reach (e.g., "Founders", "Marketing Managers")
   - **What We Offer**: Your value proposition or main offerings

2. **Generate Post**: Click the "Generate Post" button to create an AI-powered LinkedIn post

3. **Review & Edit**: The generated post will appear in the preview panel with LinkedIn-style formatting

4. **Copy & Post**: Use the copy button to copy the post to your clipboard, then paste it directly into LinkedIn

### Example Input

```
Company Name: TechStart Solutions
Company Description: We help startups automate their workflow with no-code tools
Target Audience: Startup founders and entrepreneurs
What We Offer: Custom automation solutions that save 10+ hours per week
```

### Generated Output Structure

The AI generates posts with:
- **Hook**: Attention-grabbing opening line
- **Content**: Structured content with value propositions
- **Call to Action**: Engagement-driving questions
- **Hashtags**: Relevant industry hashtags
- **Formatting**: LinkedIn-optimized formatting with emojis and line breaks

## 🔧 Configuration

### AI Models

The application supports multiple AI providers configured in `baml_src/clients.baml`:

- **OpenAI**: GPT-4o, GPT-4o-mini
- **Anthropic**: Claude-3.5-Sonnet, Claude-3-Haiku
- **Fallback & Round-robin**: Automatic failover between models

### Customizing the Prompt

Edit the prompt in `baml_src/linkedin.baml` to customize the AI generation behavior:

```baml
function GeneratePost(input: CompanyInput) -> LinkedInPostResponse {
  client "openai/gpt-4o-mini"
  prompt #"
    Your custom prompt here...
  "#
}
```

## 📁 Project Structure

```
my-baml-app/
├── src/
│   ├── app/
│   │   ├── api/post/route.ts      # API endpoint for post generation
│   │   ├── page.tsx               # Main UI component
│   │   └── layout.tsx             # App layout
├── baml_src/                      # BAML configuration files
│   ├── linkedin.baml              # LinkedIn post generation logic
│   ├── clients.baml               # AI client configurations
│   └── generators.baml            # Code generation settings
├── baml_client/                   # Generated BAML client code
└── public/                        # Static assets
```


## 🔌 API Reference

### POST /api/post

Generate a LinkedIn post based on company information.

**Request Body:**
```json
{
  "companyName": "string",
  "companyDescription": "string", 
  "targetAudience": "string",
  "whatWeOffer": "string"
}
```

**Response:**
```json
{
  "hook": "string",
  "content": "string"
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```


## 🐛 Troubleshooting

### Common Issues

1. **AI Generation Fails**: Check your API keys in `.env.local`
2. **Build Errors**: Ensure all dependencies are installed with `pnpm install`
3. **TypeScript Errors**: Run `pnpm run lint` to check for issues



## 🙏 Acknowledgments

- [BAML](https://docs.boundaryml.com/) for the AI function orchestration framework
- [Material-UI](https://mui.com/) for the beautiful UI components
- [OpenAI](https://openai.com/) and [Anthropic](https://www.anthropic.com/) for the AI models
- [Next.js](https://nextjs.org/) for the full-stack framework

---


*Star this repo if you find it useful! ⭐*
