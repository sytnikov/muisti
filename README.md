# Muisti

Transform words into meaningful context with AI-powered story generation.

## Features

- Add words to build your vocabulary
- Generate contextual stories using OpenAI GPT models
- Stories tailored for A1.2 language learning level
- Minimal, stylish black and white UI
- Responsive design
- Loading states and error handling

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **AI**: OpenAI GPT-3.5-turbo
- **Testing**: Vitest (unit tests), Playwright (e2e tests)
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- OpenAI API key

### Installation

```bash
pnpm install
```

### Environment Setup

1. Copy the environment template:

```bash
cp .env.example .env.local
```

2. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. Add your API key to `.env.local`:

```
OPENAI_API_KEY=your_actual_api_key_here
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run unit tests:

```bash
pnpm test
```

Run e2e tests:

```bash
pnpm test:e2e
```

### Build

```bash
pnpm build
pnpm start
```

## How It Works

1. **Add Words**: Enter vocabulary words you want to learn
2. **AI Generation**: The app sends your words to OpenAI's GPT-3.5-turbo model
3. **Story Creation**: The AI generates a simple, engaging story at A1.2 level that naturally incorporates all your words
4. **Learning**: Read the story to see your vocabulary words used in context

## API Endpoints

- `POST /api/generate-story` - Generates a story using the provided words

## Deployment

This project is configured for deployment on Vercel. Make sure to add your `OPENAI_API_KEY` environment variable in your Vercel dashboard.

## License

MIT
