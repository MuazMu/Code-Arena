## Code Arena - Requirements

### System Requirements
- Node.js 18.x or later
- Docker and Docker Compose
- MongoDB 6.0 or later
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/your-org/code-arena.git
cd code-arena
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
DATABASE_URL="mongodb://localhost:27017/code-arena"
NEXTAUTH_SECRET="your-secret-key"
GITHUB_ID="your-github-oauth-id"
GITHUB_SECRET="your-github-oauth-secret"
```

5. Start Docker containers:
```bash
docker-compose up -d
```

6. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

7. Start the development server:
```bash
npm run dev
```

### Additional Setup

#### Code Runner Service
The code runner service requires Docker with the following images:
- Node.js
- Python 3
- OpenJDK 11
- GCC/G++

#### Database
MongoDB should be configured with:
- Authentication enabled
- Replica set for transactions
- Regular backups
- Proper indexes for performance

#### Security
- Configure rate limiting
- Set up CORS properly
- Enable security headers
- Configure CSP
- Set up monitoring