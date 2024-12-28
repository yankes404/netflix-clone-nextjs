# Netflix Clone on Bun

Welcome to the Netflix Clone, a fully-featured streaming platform replica built with modern technologies. This project demonstrates advanced web development concepts using the Bun runtime and a cutting-edge tech stack.

## Features

- User authentication and authorization with **NextAuth**
- Fully responsive and accessible UI with **ShadCN** and **TailwindCSS**
- Database interactions using **NeonDB** and **DrizzleORM**
- Seamless email workflows with **React Email**
- State management and data fetching with **React Query**
- Payment integration with **Stripe**
- Form validation and error handling with **zod**

## Tech Stack

- [**Bun**](https://bun.sh) - Runtime for lightning-fast server-side execution
- **[Next.js](https://nextjs.org) 14.2.15** - Framework for server-side rendering and routing
- **[React](https://react.dev) 18** - UI library for building dynamic and interactive interfaces
- **[NextAuth](https://next-auth.js.org)** - Authentication library for secure login and user sessions
- **[NeonDB](https://neon.tech)** - Scalable, serverless relational database
- **[ShadCN UI](https://ui.shadcn.com)** - Accessible and customizable UI components
- **[React Query](https://tanstack.com/query/latest)** - Server state management and caching
- **[DrizzleORM](https://orm.drizzle.team)** - Type-safe, flexible, and powerful ORM
- **[Stripe](https://stripe.com)** - Payment platform for subscriptions and transactions
- **[TailwindCSS](https://tailwindcss.com)** - Utility-first CSS framework for styling

## Installation

To get started with this project, follow the steps below:

### Prerequisites

Ensure you have the following installed:
- [Bun](https://bun.sh)
- A [NeonDB](https://neon.tech) account
- A [Stripe](https://stripe.com) account for payments

### Clone the Repository
```bash
git clone https://github.com/yankes404/netflix-clone-nextjs.git
cd netflix-clone-nextjs
```

### Install Dependencies
Use Bun to install the dependencies:
```bash
bun install
```

### Environment Variables

#### .env.template
```env
DATABASE_URL=
```

#### .env.local.template
```env
NEXT_PUBLIC_APP_URL=

AUTH_SECRET=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

NEXT_PUBLIC_STRIPE_PORTAL_URL=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_EMAIL_ADDRESS=
RESEND_API_KEY=

NEXT_PUBLIC_USE_RESEND= # Due to the limitations of Resend's free plan and the lack of a custom domain, I added an option to disable emails in the demo version of the app.
```

Populate these templates and rename them to `.env` and `.env.local` respectively.

### Run the Development Server
```bash
bun run dev
```
Visit `http://localhost:3000` to view the application.

## Folder Structure

```plaintext
src/
|-- app/
|-- components/
|-- db/
|-- features/
|-- lib/
|-- auth.ts
|-- config.ts
|-- middleware.ts
|-- routes.ts
```

## Live Preview

Check out the live preview of the application: [Netflix Clone](https://yankes-netflix-clone.vercel.app/)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.