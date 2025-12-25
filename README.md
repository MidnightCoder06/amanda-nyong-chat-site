# Amanda Nyong Chat

A beautiful, modern chat website for your AI influencer Instagram account. Built with Next.js, React, TypeScript, and powered by Grok AI.

## Features

- ✨ Stunning, unique UI with animated gradients and glass morphism
- 💬 Real-time chat with Grok AI
- 💳 $5 pay-per-session paywall via Stripe
- 🛡️ Content moderation (OpenAI Moderation API)
- 📱 Fully responsive (mobile-first for Instagram traffic)
- 🎨 Beautiful animations with Framer Motion
- 🔒 No conversation history saved between sessions
- ⚡ Fast and lightweight

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Grok AI API key from [console.x.ai](https://console.x.ai)
- An OpenAI API key from [platform.openai.com](https://platform.openai.com)
- A Stripe account from [stripe.com](https://stripe.com)

### Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up your environment variables:**

Create a `.env.local` file in the root directory:

```env
# AI APIs
XAI_API_KEY=your_grok_api_key
OPENAI_API_KEY=your_openai_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx

# Session
SESSION_SECRET=your_random_32_char_secret

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Run the development server:**

```bash
npm run dev
```

4. **Open your browser:**

Visit [http://localhost:3000](http://localhost:3000) to see your landing page!

---

## Stripe Testing

### Test Mode

Use Stripe test keys (starting with `sk_test_`) during development. Get them from [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys).

### Test Card Numbers

| Card Number         | Description                       |
| ------------------- | --------------------------------- |
| 4242 4242 4242 4242 | Successful payment                |
| 4000 0000 0000 3220 | Requires 3D Secure authentication |
| 4000 0000 0000 9995 | Declined (insufficient funds)     |
| 4000 0000 0000 0002 | Declined (generic)                |

**For all test cards:**
- Use any future expiration date (e.g., `12/34`)
- Use any 3-digit CVC (e.g., `123`)
- Use any billing ZIP code (e.g., `12345`)

### Testing the Payment Flow

1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Chat with Me - $5"
4. Use test card `4242 4242 4242 4242`
5. Complete payment
6. You'll be redirected to the chat page

### Viewing Test Payments

See all test transactions at [dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)

### Going Live

1. Switch to live Stripe keys (starting with `sk_live_`)
2. Update `STRIPE_SECRET_KEY` to your live key
3. Update `NEXT_PUBLIC_BASE_URL` to your production domain

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel's dashboard:
   - `XAI_API_KEY`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `SESSION_SECRET`
   - `NEXT_PUBLIC_BASE_URL` (your production URL)
4. Deploy!

### Other Platforms

The site can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- Self-hosted with `npm run build && npm start`

---

## Customization

### Changing the AI Personality

Edit the `SYSTEM_PROMPT` in `app/api/chat/route.ts` to customize how Amanda responds.

### Changing the Price

Edit `app/api/create-checkout/route.ts`:

```typescript
unit_amount: 500, // $5.00 in cents — change to 1000 for $10, etc.
```

### Styling

- Colors and theme: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Landing page: `app/page.tsx`
- Chat UI: `app/chat/page.tsx`

### Branding

Update the title and description in `app/layout.tsx` metadata.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI:** Grok AI (via OpenAI-compatible API)
- **Moderation:** OpenAI Moderation API
- **Payments:** Stripe Checkout
- **Auth:** JWT session tokens

## License

MIT

