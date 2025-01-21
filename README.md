<img src="/static/logos/full.png" alt="team spiral racing logo" width="400"/>
<a href="https://github.com/jonathanlo411/TeamSpiralRacing/releases"><img src="https://img.shields.io/github/v/release/jonathanlo411/TeamSpiralRacing?color=f56827"></a>
<a href="https://github.com/jonathanlo411/TeamSpiralRacing/blob/main/LICENSE"><img src="https://img.shields.io/github/license/jonathanlo411/TeamSpiralRacing"></a>

This is the websitre repository for the [Team Spiral Racing website](https://www.teamspiralracing.com/).

## Developing Locally
1. Install dependencies.
```
npm install
```
2. Fill out `.env` with the same structure as `sample.env`.
3. Generate Prisma schema and push to the database.
```
npx prisma generate && npx prisma db push
```
4. Start development server.
```
npm run dev -- --host
```

## License
This project is licensed under the GNU General Public License. See `LICENSE` for more information.
